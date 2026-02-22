import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { ZodError } from "zod";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
    return;
  }

  if (err instanceof ZodError) {
    const issues = (err as any).issues ?? (err as any).errors ?? [];
    res.status(422).json({
      status: "validation_error",
      errors: issues.map((e: any) => ({
        field: Array.isArray(e.path) ? e.path.join(".") : String(e.path ?? ""),
        message: e.message,
      })),
    });
    return;
  }

  console.error("Unexpected error:", err);

  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
}
