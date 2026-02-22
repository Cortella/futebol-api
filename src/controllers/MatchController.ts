import { Request, Response } from "express";
import { MatchService } from "../services/MatchService";
import { createMatchSchema } from "../schemas/match.schema";

export class MatchController {
  private matchService = new MatchService();

  async findAll(_req: Request, res: Response): Promise<void> {
    const matches = await this.matchService.findAll();

    res.json(matches);
  }

  async findByRound(req: Request, res: Response): Promise<void> {
    const matches = await this.matchService.findByRound(String(req.params.roundId));

    res.json(matches);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const match = await this.matchService.findById(String(req.params.id));

    res.json(match);
  }

  async create(req: Request, res: Response): Promise<void> {
    const data = createMatchSchema.parse(req.body);
    const match = await this.matchService.create(data);

    res.status(201).json(match);
  }

  async delete(req: Request, res: Response): Promise<void> {
    await this.matchService.delete(String(req.params.id));

    res.status(204).send();
  }
}
