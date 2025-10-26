import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../utils/appError";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  console.log("🔐 isAuthenticated check:", {
    path: req.path,
    hasCookie: !!req.headers.cookie,
    cookie: req.headers.cookie?.substring(0, 50) + "...",
    hasSession: !!(req as any).session,
    hasUser: !!req.user,
    userId: req.user?._id,
  });

  if (!req.user || !req.user._id) {
    throw new UnauthorizedException("Пожалуйста, войдите в систему.");
  }
  next();
};

export default isAuthenticated;
