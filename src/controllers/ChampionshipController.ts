import { Request, Response } from "express";
import { ChampionshipService } from "../services/ChampionshipService";
import { createChampionshipSchema, updateChampionshipSchema } from "../schemas/championship.schema";

export class ChampionshipController {
  private championshipService = new ChampionshipService();

  async findAll(_req: Request, res: Response): Promise<void> {
    const championships = await this.championshipService.findAll();

    res.json(championships);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const championship = await this.championshipService.findById(req.params.id);

    res.json(championship);
  }

  async create(req: Request, res: Response): Promise<void> {
    const data = createChampionshipSchema.parse(req.body);
    const championship = await this.championshipService.create(data);

    res.status(201).json(championship);
  }

  async update(req: Request, res: Response): Promise<void> {
    const data = updateChampionshipSchema.parse(req.body);
    const championship = await this.championshipService.update(req.params.id, data);

    res.json(championship);
  }

  async delete(req: Request, res: Response): Promise<void> {
    await this.championshipService.delete(req.params.id);

    res.status(204).send();
  }
}
