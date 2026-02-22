import { Router } from "express";
import { LineupController } from "../controllers/LineupController";
import { authGuard } from "../middlewares/authGuard";

const lineupRouter = Router();
const controller = new LineupController();

lineupRouter.use(authGuard);

lineupRouter.get("/career/:careerId", (req, res) => controller.findByCareer(req, res));
lineupRouter.get("/:id", (req, res) => controller.findById(req, res));
lineupRouter.post("/", (req, res) => controller.create(req, res));
lineupRouter.put("/:id", (req, res) => controller.update(req, res));
lineupRouter.delete("/:id", (req, res) => controller.delete(req, res));

export { lineupRouter };
