// Утилиты для работы с данными Aurora Rise в localStorage

const AURORA_USER_KEY = 'aurora-rise-user';
const AUTO_LOGIN_SUCCESS_KEY = 'aurora-auto-login-success';

export interface AuroraUser {
  _id: string;
  name: string;
  email: string;
  username?: string;
  profilePicture?: string | null;
  userRole?: 'coach' | 'athlete';
  [key: string]: unknown;
}

export const saveAuroraUser = (user: AuroraUser): void => {
  try {
    localStorage.setItem(AURORA_USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving Aurora user:', error);
  }
};

export const getAuroraUser = (): AuroraUser | null => {
  try {
    const savedUser = localStorage.getItem(AURORA_USER_KEY);
    if (savedUser) {
      return JSON.parse(savedUser);
    }
  } catch (error) {
    console.error('Error parsing saved Aurora user:', error);
    localStorage.removeItem(AURORA_USER_KEY);
  }
  return null;
};

export const clearAuroraUser = (): void => {
  try {
    localStorage.removeItem(AURORA_USER_KEY);
  } catch (error) {
    console.error('Error clearing Aurora user:', error);
  }
};

export const hasAuroraUser = (): boolean => {
  return getAuroraUser() !== null;
};

export const setAutoLoginSuccess = (): void => {
  try {
    localStorage.setItem(AUTO_LOGIN_SUCCESS_KEY, 'true');
  } catch (error) {
    console.error('Error setting auto login success flag:', error);
  }
};

export const getAutoLoginSuccess = (): boolean => {
  try {
    return localStorage.getItem(AUTO_LOGIN_SUCCESS_KEY) === 'true';
  } catch (error) {
    console.error('Error getting auto login success flag:', error);
    return false;
  }
};

export const clearAutoLoginSuccess = (): void => {
  try {
    localStorage.removeItem(AUTO_LOGIN_SUCCESS_KEY);
  } catch (error) {
    console.error('Error clearing auto login success flag:', error);
  }
};
