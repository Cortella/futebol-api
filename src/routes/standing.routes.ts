import { Router } from "express";
import { StandingController } from "../controllers/StandingController";
import { authGuard } from "../middlewares/authGuard";

const standingRouter = Router();
const controller = new StandingController();

standingRouter.use(authGuard);

standingRouter.get("/division/:divisionId", (req, res) => controller.findByDivision(req, res));
standingRouter.get("/:id", (req, res) => controller.findById(req, res));
standingRouter.post("/", (req, res) => controller.create(req, res));
standingRouter.delete("/:id", (req, res) => controller.delete(req, res));

export { standingRouter };
