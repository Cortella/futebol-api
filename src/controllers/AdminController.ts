import { Response, NextFunction, Router } from "express";
import { AuthRequest, authGuard, adminGuard } from "../middlewares/authGuard";
import { AppError } from "../errors/AppError";

export abstract class AdminController {
  public readonly router: Router;

  constructor() {
    this.router = Router();
    this.router.use(authGuard);
    this.router.use(adminGuard);
    this.setupRoutes();
  }

  protected abstract setupRoutes(): void;

  protected ensureAdmin(req: AuthRequest): void {
    if (!req.user || req.user.role !== "admin") {
      throw new AppError("Access denied. Admin privileges required", 403);
    }
  }

  protected getUserId(req: AuthRequest): string {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    return req.user.id;
  }

  protected ok(res: Response, data: unknown, statusCode = 200): void {
    res.status(statusCode).json(data);
  }

  protected created(res: Response, data: unknown): void {
    res.status(201).json(data);
  }

  protected noContent(res: Response): void {
    res.status(204).send();
  }

  protected handleAsync(
    fn: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>,
  ): (req: AuthRequest, res: Response, next: NextFunction) => Promise<void> {
    return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      try {
        await fn(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  }
}
