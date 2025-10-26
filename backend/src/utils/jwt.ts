import jwt from 'jsonwebtoken';
import { config } from '../config/app.config';

export interface JWTPayload {
  userId: string;
  email: string;
}

/**
 * Генерация JWT токена
 */
export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: '7d', // Токен действителен 7 дней
  });
};

/**
 * Проверка и декодирование JWT токена
 */
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
};

/**
 * Извлечение токена из заголовка Authorization
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Убираем "Bearer "
};

