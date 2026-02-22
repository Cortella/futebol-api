import { Router } from "express";
import { ChampionshipController } from "../controllers/ChampionshipController";
import { authGuard } from "../middlewares/authGuard";

const championshipRouter = Router();
const controller = new ChampionshipController();

championshipRouter.use(authGuard);

championshipRouter.get("/", (req, res) => controller.findAll(req, res));
championshipRouter.get("/:id", (req, res) => controller.findById(req, res));
championshipRouter.get("/:id/divisions", (req, res) => controller.findDivisions(req, res));
championshipRouter.post("/", (req, res) => controller.create(req, res));
championshipRouter.put("/:id", (req, res) => controller.update(req, res));
championshipRouter.delete("/:id", (req, res) => controller.delete(req, res));

export { championshipRouter };
