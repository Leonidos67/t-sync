import { CustomError } from "@/types/custom-error.type";
import axios from "axios";
import { getToken } from "./tokenStorage";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const options = {
  baseURL,
  withCredentials: true,
  timeout: 10000,
};

const API = axios.create(options);

// Request interceptor: автоматически добавляем JWT токен
API.interceptors.request.use(
  (config) => {
    const token = getToken();
    
    // Добавляем JWT токен в заголовок Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('🌐 Axios - Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      hasToken: !!token,
      withCredentials: config.withCredentials
    });
    return config;
  },
  (error) => {
    console.error('🌐 Axios - Request error:', error);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    console.log('🌐 Axios - Success response:', response.config.url, response.status);
    return response;
  },
  async (error) => {
    const { data, status } = error.response || {};
    
    console.error('🌐 Axios - Error response:', {
      url: error.config?.url,
      status,
      data,
      message: error.message
    });

    // Do not hard-redirect on 401 here; let callers decide how to handle it

    const customError: CustomError = {
      ...error,
      errorCode: data?.errorCode || (status === 401 ? "UNAUTHORIZED" : "UNKNOWN_ERROR"),
    };

    return Promise.reject(customError);
  }
);

export default API;
