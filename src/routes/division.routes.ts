import { Router } from "express";
import { DivisionController } from "../controllers/DivisionController";
import { authGuard } from "../middlewares/authGuard";

const divisionRouter = Router();
const controller = new DivisionController();

divisionRouter.use(authGuard);

divisionRouter.get("/", (req, res) => controller.findAll(req, res));
divisionRouter.get("/:id", (req, res) => controller.findById(req, res));
divisionRouter.get("/championship/:championshipId", (req, res) =>
  controller.findByChampionship(req, res),
);
divisionRouter.post("/", (req, res) => controller.create(req, res));
divisionRouter.put("/:id", (req, res) => controller.update(req, res));
divisionRouter.delete("/:id", (req, res) => controller.delete(req, res));

export { divisionRouter };
