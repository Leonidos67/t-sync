import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { config } from "../config/app.config";
import { registerSchema } from "../validation/auth.validation";
import { HTTPSTATUS } from "../config/http.config";
import { registerUserService, updateUserRoleService } from "../services/auth.service";
import passport from "passport";
import AccountModel from "../models/account.model";
import UserModel from "../models/user.model";
import { ProviderEnum } from "../enums/account-provider.enum";

export const googleLoginCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const currentWorkspace = req.user?.currentWorkspace;

    if (!currentWorkspace) {
      return res.redirect(
        `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
      );
    }

    return res.redirect(
      `${config.FRONTEND_URL}/`
    );
  }
);

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse({
      ...req.body,
    });

    await registerUserService(body);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Пользователь успешно создан",
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      (
        err: Error | null,
        user: Express.User | false,
        info: { message: string } | undefined
      ) => {
        if (err) {
          return next(err);
        }

        if (!user) {
          return res.status(HTTPSTATUS.UNAUTHORIZED).json({
            message: info?.message || "Неверный адрес электронной почты или пароль",
          });
        }

        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }

          return res.status(HTTPSTATUS.OK).json({
            message: "Успешно вошел в систему",
            user,
          });
        });
      }
    )(req, res, next);
  }
);

export const logOutController = asyncHandler(
  async (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        console.error("Ошибка выхода из системы:", err);
        return res
          .status(HTTPSTATUS.INTERNAL_SERVER_ERROR)
          .json({ error: "Не удалось выйти из системы" });
      }
    });

    return res
      .status(HTTPSTATUS.OK)
      .json({ message: "Успешно вышел из системы" });
  }
);

export const updateUserRoleController = asyncHandler(
  async (req: Request, res: Response) => {
    const { userRole } = req.body;
    
    if (!req.user?._id) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Пользователь не авторизован",
      });
    }

    const updatedUser = await updateUserRoleService(req.user._id.toString(), userRole);

    return res.status(HTTPSTATUS.OK).json({
      message: "Роль пользователя успешно обновлена",
      user: updatedUser,
    });
  }
);

export const autoLoginController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, targetService } = req.body;
    
    console.log('Auto login request:', { email, targetService, currentUser: req.user });
    
    if (!email) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Email обязателен для автоматического входа",
      });
    }

    // Проверяем, есть ли уже активная сессия для этого пользователя
    if (req.user && req.user.email === email) {
      console.log('User already logged in, returning existing session');
      return res.status(HTTPSTATUS.OK).json({
        message: "Успешно вошел в систему",
        user: req.user,
        targetService: targetService || 'volt', // По умолчанию перенаправляем в Volt
      });
    }

    // Если нет активной сессии, пытаемся найти пользователя и создать сессию
    try {
      console.log('Looking for account with email:', email);
      const account = await AccountModel.findOne({ 
        provider: ProviderEnum.EMAIL, 
        providerId: email 
      });
      
      if (!account) {
        console.log('Account not found for email:', email);
        return res.status(HTTPSTATUS.UNAUTHORIZED).json({
          message: "Пользователь не найден",
        });
      }

      console.log('Account found, looking for user:', account.userId);
      const user = await UserModel.findById(account.userId);
      if (!user) {
        console.log('User not found for account:', account.userId);
        return res.status(HTTPSTATUS.UNAUTHORIZED).json({
          message: "Пользователь не найден",
        });
      }

      console.log('User found, creating session for:', user.email);
      // Создаем сессию для пользователя
      req.logIn(user.omitPassword(), (err) => {
        if (err) {
          console.error('Error creating session:', err);
          return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
            message: "Ошибка создания сессии",
          });
        }

        console.log('Session created successfully for:', user.email);
        return res.status(HTTPSTATUS.OK).json({
          message: "Успешно вошел в систему",
          user: user.omitPassword(),
          targetService: targetService || 'volt', // По умолчанию перенаправляем в Volt
        });
      });
    } catch (error) {
      console.error('Auto login error:', error);
      return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Ошибка автоматического входа",
      });
    }
  }
);