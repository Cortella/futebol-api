import { Router } from "express";
import { authRouter } from "./auth.routes";
import { teamRouter } from "./team.routes";
import { championshipRouter } from "./championship.routes";
import { divisionRouter } from "./division.routes";
import { careerRouter } from "./career.routes";

const routes = Router();

routes.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

routes.use("/auth", authRouter);
routes.use("/teams", teamRouter);
routes.use("/championships", championshipRouter);
routes.use("/divisions", divisionRouter);
routes.use("/careers", careerRouter);

export { routes };
