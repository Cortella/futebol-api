import { Router } from "express";
import { MatchController } from "../controllers/MatchController";
import { authGuard } from "../middlewares/authGuard";

const matchRouter = Router();
const controller = new MatchController();

matchRouter.use(authGuard);

matchRouter.get("/", (req, res) => controller.findAll(req, res));
matchRouter.get("/round/:roundId", (req, res) => controller.findByRound(req, res));
matchRouter.get("/:id", (req, res) => controller.findById(req, res));
matchRouter.post("/", (req, res) => controller.create(req, res));
matchRouter.delete("/:id", (req, res) => controller.delete(req, res));

export { matchRouter };
