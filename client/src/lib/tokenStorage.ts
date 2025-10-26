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
    console.log('✅ Token saved to localStorage:', token.substring(0, 20) + '...');
    // Проверяем, что токен сохранился
    const savedToken = localStorage.getItem(TOKEN_KEY);
    console.log('✅ Token verification:', savedToken === token ? 'SUCCESS' : 'FAILED');
  } catch (error) {
    console.error('❌ Failed to save token:', error);
  }
};

/**
 * Получить JWT токен из localStorage
 */
export const getToken = (): string | null => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    console.log('🔑 Getting token from localStorage:', token ? token.substring(0, 20) + '...' : 'NOT FOUND');
    return token;
  } catch (error) {
    console.error('❌ Failed to get token:', error);
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

