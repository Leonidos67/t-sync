import dotenv from "dotenv";
dotenv.config();
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "cookie-session";
import path from "path";
import fs from "fs";
import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { HTTPSTATUS } from "./config/http.config";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import { BadRequestException } from "./utils/appError";
import { ErrorCodeEnum } from "./enums/error-code.enum";

import "./config/passport.config";
import passport from "passport";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import isAuthenticated from "./middlewares/isAuthenticated.middleware";
import workspaceRoutes from "./routes/workspace.route";
import memberRoutes from "./routes/member.route";
import projectRoutes from "./routes/project.route";
import taskRoutes from "./routes/task.route";
import publicUserRoutes from "./routes/public-user.route";
import websiteRoutes from "./routes/website.route";
import aiRoutes from "./routes/ai.route";
import downloadRoutes from "./routes/download.route";

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "session",
    keys: [config.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    // Use non-secure cookies on localhost (even if NODE_ENV=production) or when running Electron desktop
    secure:
      config.NODE_ENV === "production" &&
      process.env.DESKTOP_APP !== "true" &&
      // allow non-secure when FRONTEND_ORIGIN is localhost over http
      !/^http:\/\/localhost(?::\d+)?$/.test(config.FRONTEND_ORIGIN),
    httpOnly: true,
    // Use "none" for production cross-origin requests (Vercel <-> Railway)
    // Use "lax" for localhost development
    sameSite: config.NODE_ENV === "production" && 
      !process.env.DESKTOP_APP && 
      !/^http:\/\/localhost(?::\d+)?$/.test(config.FRONTEND_ORIGIN) 
      ? "none" 
      : "lax",
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin like mobile apps or curl
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        config.FRONTEND_ORIGIN,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
      ];

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // In development, allow any localhost origin
      if (
        config.NODE_ENV !== "production" &&
        /^http:\/\/localhost:\d+$/.test(origin)
      ) {
        return callback(null, true);
      }

      callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  })
);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root route is handled by SPA static handler in production; avoid throwing here

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user/public`, publicUserRoutes);
app.use(`${BASE_PATH}/website`, websiteRoutes);
app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes);
app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes);
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);
app.use(`${BASE_PATH}/project`, isAuthenticated, projectRoutes);
app.use(`${BASE_PATH}/task`, isAuthenticated, taskRoutes);
app.use(`${BASE_PATH}/v1/ai`, aiRoutes);
app.use(`${BASE_PATH}/downloads`, downloadRoutes);

// Serve static SPA if client build is present (handles packaged Electron paths)
if (config.NODE_ENV === "production") {
  const candidatePaths = [
    // When running from backend/dist inside packaged app: go up to app root then client/dist
    path.join(__dirname, "../../client/dist"),
    // When running locally beside backend/dist
    path.join(__dirname, "../client/dist"),
  ];

  const clientDist = candidatePaths.find((p) => fs.existsSync(path.join(p, "index.html")));

  if (clientDist) {
    app.use(express.static(clientDist));

    // Catch all handler for SPA - serve index.html for all non-API routes
    app.get("*", (req, res) => {
      if (!req.path.startsWith("/api")) {
        res.sendFile(path.join(clientDist as string, "index.html"));
      } else {
        res.status(404).json({ message: "API endpoint not found" });
      }
    });
  }
}

app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
  await connectDatabase();
});
