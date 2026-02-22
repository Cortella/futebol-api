import { Router } from "express";
import { TeamController } from "../controllers/TeamController";

const teamRoutes = Router();
const controller = new TeamController();

teamRoutes.get("/", controller.index);
teamRoutes.get("/:id", controller.show);
teamRoutes.post("/", controller.store);
teamRoutes.put("/:id", controller.update);
teamRoutes.delete("/:id", controller.destroy);

export { teamRoutes };
