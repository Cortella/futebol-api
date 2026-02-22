import { Router } from "express";
import { SeasonController } from "../controllers/SeasonController";
import { authGuard } from "../middlewares/authGuard";

const seasonRouter = Router();
const controller = new SeasonController();

seasonRouter.use(authGuard);

seasonRouter.get("/", (req, res) => controller.findAll(req, res));
seasonRouter.get("/:id", (req, res) => controller.findById(req, res));
seasonRouter.post("/", (req, res) => controller.create(req, res));
seasonRouter.put("/:id", (req, res) => controller.update(req, res));
seasonRouter.delete("/:id", (req, res) => controller.delete(req, res));

export { seasonRouter };
