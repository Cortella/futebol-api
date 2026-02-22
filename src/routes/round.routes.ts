import { Router } from "express";
import { RoundController } from "../controllers/RoundController";
import { authGuard } from "../middlewares/authGuard";

const roundRouter = Router();
const controller = new RoundController();

roundRouter.use(authGuard);

roundRouter.get("/", (req, res) => controller.findAll(req, res));
roundRouter.get("/division/:divisionId", (req, res) => controller.findByDivision(req, res));
roundRouter.get("/:id", (req, res) => controller.findById(req, res));
roundRouter.post("/", (req, res) => controller.create(req, res));
roundRouter.delete("/:id", (req, res) => controller.delete(req, res));

export { roundRouter };
