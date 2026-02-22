import { Router } from "express";
import { PlayerController } from "../controllers/PlayerController";
import { authGuard } from "../middlewares/authGuard";

const playerRouter = Router();
const controller = new PlayerController();

playerRouter.use(authGuard);

playerRouter.get("/", (req, res) => controller.findAll(req, res));
playerRouter.get("/team/:teamId", (req, res) => controller.findByTeam(req, res));
playerRouter.get("/:id", (req, res) => controller.findById(req, res));
playerRouter.post("/", (req, res) => controller.create(req, res));
playerRouter.put("/:id", (req, res) => controller.update(req, res));
playerRouter.delete("/:id", (req, res) => controller.delete(req, res));

export { playerRouter };
