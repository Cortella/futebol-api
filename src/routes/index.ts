import { Router } from "express";
import { authRouter } from "./auth.routes";

const routes = Router();

routes.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

routes.use("/auth", authRouter);

export { routes };
