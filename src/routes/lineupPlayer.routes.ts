import { Router } from "express";
import { LineupPlayerController } from "../controllers/LineupPlayerController";
import { authGuard } from "../middlewares/authGuard";

const lineupPlayerRouter = Router();
const controller = new LineupPlayerController();

lineupPlayerRouter.use(authGuard);

lineupPlayerRouter.get("/lineup/:lineupId", (req, res) => controller.findByLineup(req, res));
lineupPlayerRouter.get("/:id", (req, res) => controller.findById(req, res));
lineupPlayerRouter.post("/", (req, res) => controller.create(req, res));
lineupPlayerRouter.put("/:id", (req, res) => controller.update(req, res));
lineupPlayerRouter.delete("/:id", (req, res) => controller.delete(req, res));

export { lineupPlayerRouter };
