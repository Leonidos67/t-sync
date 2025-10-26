/**
 * Утилиты для работы с JWT токеном в localStorage
 */

const TOKEN_KEY = 'auth_token';

/**
 * Сохранить JWT токен в localStorage
 */
export const setToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to save token:', error);
  }
};

/**
 * Получить JWT токен из localStorage
 */
export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
};

/**
 * Удалить JWT токен из localStorage
 */
export const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to remove token:', error);
  }
};

/**
 * Проверить, есть ли JWT токен
 */
export const hasToken = (): boolean => {
  return !!getToken();
};

