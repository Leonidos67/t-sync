import { getEnv } from "../utils/get-env";

const appConfig = () => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: getEnv("PORT", "8000"),
  BASE_PATH: getEnv("BASE_PATH", "/api"),
  MONGO_URI: getEnv("MONGO_URI", "mongodb+srv://wotbmadgamesexe:wotbmadgamesexe123@cluster0.tppwoc6.mongodb.net/"),

  SESSION_SECRET: getEnv("SESSION_SECRET", "wotbmadgamesexe123"),
  SESSION_EXPIRES_IN: getEnv("SESSION_EXPIRES_IN", "1d"),

  GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID", "1072181846694-el2tmva90ht6vmlias91ddt0gbhgcngi.apps.googleusercontent.com"),
  GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET", "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"),
  GOOGLE_CALLBACK_URL: getEnv("GOOGLE_CALLBACK_URL", "http://localhost:8000/api/auth/google/callback"),

  GEMINI_API_KEY: getEnv("GEMINI_API_KEY", "AIzaSyCdd2hsJ6YM0F1W-VS6ORmS-_l3qlK91XM"),

  FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "http://localhost:5173"),
  FRONTEND_GOOGLE_CALLBACK_URL: getEnv("FRONTEND_GOOGLE_CALLBACK_URL", "http://localhost:5173/google/callback"),

  GEMINI_MODEL: getEnv("GEMINI_MODEL", "gemini-2.0-flash"),
  GEMINI_API_URL: getEnv("GEMINI_API_URL", "https://generativelanguage.googleapis.com/v1beta/models"),

  FRONTEND_URL: getEnv("FRONTEND_URL", "http://localhost:5173"),
});

export const config = appConfig();
