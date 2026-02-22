import { Router } from "express";
import { TeamController } from "../controllers/TeamController";
import { authGuard } from "../middlewares/authGuard";

const teamRouter = Router();
const controller = new TeamController();

teamRouter.use(authGuard);

teamRouter.get("/", (req, res) => controller.findAll(req, res));
teamRouter.get("/:id", (req, res) => controller.findById(req, res));
teamRouter.post("/", (req, res) => controller.create(req, res));
teamRouter.put("/:id", (req, res) => controller.update(req, res));
teamRouter.delete("/:id", (req, res) => controller.delete(req, res));

export { teamRouter };
