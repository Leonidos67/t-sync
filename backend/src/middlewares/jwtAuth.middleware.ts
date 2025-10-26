import { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "../utils/appError";
import { extractTokenFromHeader, verifyToken } from "../utils/jwt";
import UserModel from "../models/user.model";

/**
 * Middleware для проверки JWT токена
 */
export const jwtAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Извлекаем токен из заголовка
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      console.log("🔐 JWT Auth: No token provided");
      throw new UnauthorizedException("Требуется аутентификация. Пожалуйста, войдите в систему.");
    }

    // Проверяем токен
    const payload = verifyToken(token);
    
    if (!payload) {
      console.log("🔐 JWT Auth: Invalid token");
      throw new UnauthorizedException("Недействительный токен. Пожалуйста, войдите в систему снова.");
    }

    console.log("🔐 JWT Auth: Token valid for user:", payload.userId);

    // Загружаем пользователя из БД
    const user = await UserModel.findById(payload.userId);
    
    if (!user) {
      console.log("🔐 JWT Auth: User not found:", payload.userId);
      throw new UnauthorizedException("Пользователь не найден.");
    }

    // Добавляем пользователя в req для использования в контроллерах
    req.user = user.omitPassword();
    
    next();
  } catch (error) {
    next(error);
  }
};

export default jwtAuth;

