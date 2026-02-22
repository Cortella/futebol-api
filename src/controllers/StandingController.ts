import { Request, Response } from "express";
import { StandingService } from "../services/StandingService";
import { createStandingSchema } from "../schemas/standing.schema";

export class StandingController {
  private standingService = new StandingService();

  async findByDivision(req: Request, res: Response): Promise<void> {
    const standings = await this.standingService.findByDivision(String(req.params.divisionId));

    res.json(standings);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const standing = await this.standingService.findById(String(req.params.id));

    res.json(standing);
  }

  async create(req: Request, res: Response): Promise<void> {
    const data = createStandingSchema.parse(req.body);
    const standing = await this.standingService.create(data);

    res.status(201).json(standing);
  }

  async delete(req: Request, res: Response): Promise<void> {
    await this.standingService.delete(String(req.params.id));

    res.status(204).send();
  }
}
