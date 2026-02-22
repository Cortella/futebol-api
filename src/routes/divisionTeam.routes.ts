import { Router } from "express";
import { DivisionTeamController } from "../controllers/DivisionTeamController";
import { authGuard } from "../middlewares/authGuard";

const divisionTeamRouter = Router();
const controller = new DivisionTeamController();

divisionTeamRouter.use(authGuard);

divisionTeamRouter.get("/", (req, res) => controller.findAll(req, res));
divisionTeamRouter.get("/division/:divisionId", (req, res) => controller.findByDivision(req, res));
divisionTeamRouter.get("/:id", (req, res) => controller.findById(req, res));
divisionTeamRouter.post("/", (req, res) => controller.create(req, res));
divisionTeamRouter.put("/:id", (req, res) => controller.update(req, res));
divisionTeamRouter.delete("/:id", (req, res) => controller.delete(req, res));

export { divisionTeamRouter };
