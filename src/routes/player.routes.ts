import { Router } from "express";
import { PlayerController } from "../controllers/PlayerController";

const playerRoutes = Router();
const controller = new PlayerController();

playerRoutes.get("/", controller.index);
playerRoutes.get("/:id", controller.show);
playerRoutes.get("/team/:teamId", controller.byTeam);
playerRoutes.post("/", controller.store);
playerRoutes.put("/:id", controller.update);
playerRoutes.delete("/:id", controller.destroy);

export { playerRoutes };
