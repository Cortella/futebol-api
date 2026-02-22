import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

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

  // TODO: Implementar verificação JWT real quando a entidade User for criada
  // Por enquanto, o token é validado mas o decode será integrado depois
  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new AppError("Token not provided", 401);
  }

  // Placeholder: será substituído por jwt.verify() na implementação de auth
  next();
}

export function adminGuard(req: AuthRequest, _res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== "admin") {
    throw new AppError("Access denied. Admin privileges required", 403);
  }

  next();
}
