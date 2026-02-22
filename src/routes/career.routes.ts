import { Router } from "express";
import { CareerController } from "../controllers/CareerController";
import { authGuard, AuthRequest } from "../middlewares/authGuard";

const careerRouter = Router();
const controller = new CareerController();

careerRouter.use(authGuard);

careerRouter.get("/", (req, res) => controller.findAll(req as AuthRequest, res));
careerRouter.get("/:id", (req, res) => controller.findById(req as AuthRequest, res));
careerRouter.post("/", (req, res) => controller.create(req as AuthRequest, res));
careerRouter.delete("/:id", (req, res) => controller.delete(req as AuthRequest, res));

export { careerRouter };
