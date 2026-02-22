import { Router } from "express";
import { teamRoutes } from "./team.routes";
import { playerRoutes } from "./player.routes";

const routes = Router();

routes.use("/teams", teamRoutes);
routes.use("/players", playerRoutes);

routes.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export { routes };
