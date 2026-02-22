import { Router } from "express";
import { TransferController } from "../controllers/TransferController";
import { authGuard } from "../middlewares/authGuard";

const transferRouter = Router();
const controller = new TransferController();

transferRouter.use(authGuard);

transferRouter.get("/", (req, res) => controller.findAll(req, res));
transferRouter.get("/season/:seasonId", (req, res) => controller.findBySeason(req, res));
transferRouter.get("/:id", (req, res) => controller.findById(req, res));
transferRouter.post("/", (req, res) => controller.create(req, res));
transferRouter.delete("/:id", (req, res) => controller.delete(req, res));

export { transferRouter };
