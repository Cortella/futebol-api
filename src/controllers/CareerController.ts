import { Response } from "express";
import { CareerService } from "../services/CareerService";
import { createCareerSchema } from "../schemas/career.schema";
import { AuthRequest } from "../middlewares/authGuard";
import { AppError } from "../errors/AppError";

export class CareerController {
  private careerService = new CareerService();

  async findAll(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Token not provided", 401);
    }

    const careers = await this.careerService.findAllByUser(userId);

    res.json(careers);
  }

  async findById(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Token not provided", 401);
    }

    const career = await this.careerService.findById(String(req.params.id), userId);

    res.json(career);
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Token not provided", 401);
    }

    const data = createCareerSchema.parse(req.body);
    const career = await this.careerService.create(userId, data);

    res.status(201).json(career);
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Token not provided", 401);
    }

    await this.careerService.delete(String(req.params.id), userId);

    res.status(204).send();
  }
}
