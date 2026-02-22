import { Request, Response } from "express";
import { SeasonService } from "../services/SeasonService";
import { createSeasonSchema, updateSeasonSchema } from "../schemas/season.schema";

export class SeasonController {
  private seasonService = new SeasonService();

  async findAll(_req: Request, res: Response): Promise<void> {
    const seasons = await this.seasonService.findAll();

    res.json(seasons);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const season = await this.seasonService.findById(req.params.id);

    res.json(season);
  }

  async create(req: Request, res: Response): Promise<void> {
    const data = createSeasonSchema.parse(req.body);
    const season = await this.seasonService.create(data);

    res.status(201).json(season);
  }

  async update(req: Request, res: Response): Promise<void> {
    const data = updateSeasonSchema.parse(req.body);
    const season = await this.seasonService.update(req.params.id, data);

    res.json(season);
  }

  async delete(req: Request, res: Response): Promise<void> {
    await this.seasonService.delete(req.params.id);

    res.status(204).send();
  }
}
