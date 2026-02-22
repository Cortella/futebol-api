import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { env } from "../config/env";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: "user" | "admin";
  };
}

export function authGuard(req: AuthRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Token not provided", 401);
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new AppError("Token not provided", 401);
  }

  try {
    const decoded = jwt.verify(token, env.jwt.secret) as {
      id: string;
      email: string;
      role: "user" | "admin";
    };

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }
}

export function adminGuard(req: AuthRequest, _res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== "admin") {
    throw new AppError("Access denied. Admin privileges required", 403);
  }

  next();
}
