import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { config } from "../config/app.config";
import { registerSchema } from "../validation/auth.validation";
import { HTTPSTATUS } from "../config/http.config";
import { registerUserService, updateUserRoleService, verifyUserService, loginOrCreateAccountService } from "../services/auth.service";
import passport from "passport";
import AccountModel from "../models/account.model";
import UserModel from "../models/user.model";
import { ProviderEnum } from "../enums/account-provider.enum";
import { generateToken } from "../utils/jwt";

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
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Email и пароль обязательны",
      });
    }

    // Проверяем пользователя
    const user = await verifyUserService({ email, password });

    // Генерируем JWT токен
    const token = generateToken({
      userId: String(user._id),
      email: user.email || email,
    });

    console.log("✅ Login successful, JWT token generated:", {
      userId: user._id,
      email: user.email,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Успешно вошел в систему",
      user: user.omitPassword(),
      token, // Возвращаем JWT токен клиенту
    });
  }
);

export const logOutController = asyncHandler(
  async (req: Request, res: Response) => {
    // С JWT токенами логаут происходит на клиенте (удаление токена из localStorage)
    // Сервер не хранит сессии, поэтому здесь ничего делать не нужно
    
    console.log("🔐 User logged out:", req.user?._id);

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

    // Проверяем, есть ли уже JWT токен (пользователь авторизован)
    if (req.user && req.user.email === email) {
      console.log('User already logged in with JWT');
      return res.status(HTTPSTATUS.OK).json({
        message: "Успешно вошел в систему",
        user: req.user,
        targetService: targetService || 'volt',
      });
    }

    // Ищем пользователя по email
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

    // Генерируем JWT токен
    const token = generateToken({
      userId: String(user._id),
      email: user.email || '',
    });

    console.log('JWT token generated successfully for:', user.email);
    return res.status(HTTPSTATUS.OK).json({
      message: "Успешно вошел в систему",
      user: user.omitPassword(),
      token,
      targetService: targetService || 'volt',
    });
  }
);