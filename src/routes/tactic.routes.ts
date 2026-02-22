import { Router } from "express";
import { TacticController } from "../controllers/TacticController";
import { authGuard } from "../middlewares/authGuard";

const tacticRouter = Router();
const controller = new TacticController();

tacticRouter.use(authGuard);

tacticRouter.get("/career/:careerId", (req, res) => controller.findByCareer(req, res));
tacticRouter.get("/:id", (req, res) => controller.findById(req, res));
tacticRouter.post("/", (req, res) => controller.create(req, res));
tacticRouter.put("/:id", (req, res) => controller.update(req, res));
tacticRouter.delete("/:id", (req, res) => controller.delete(req, res));

export { tacticRouter };
