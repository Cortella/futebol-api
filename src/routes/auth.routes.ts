import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const authRouter = Router();
const controller = new AuthController();

authRouter.post("/register", (req, res) => controller.register(req, res));
authRouter.post("/login", (req, res) => controller.login(req, res));

export { authRouter };
