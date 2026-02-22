import { Request, Response } from "express";
import { RoundService } from "../services/RoundService";
import { createRoundSchema } from "../schemas/round.schema";

export class RoundController {
  private roundService = new RoundService();

  async findAll(_req: Request, res: Response): Promise<void> {
    const rounds = await this.roundService.findAll();

    res.json(rounds);
  }

  async findByDivision(req: Request, res: Response): Promise<void> {
    const rounds = await this.roundService.findByDivision(req.params.divisionId);

    res.json(rounds);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const round = await this.roundService.findById(req.params.id);

    res.json(round);
  }

  async create(req: Request, res: Response): Promise<void> {
    const data = createRoundSchema.parse(req.body);
    const round = await this.roundService.create(data);

    res.status(201).json(round);
  }

  async delete(req: Request, res: Response): Promise<void> {
    await this.roundService.delete(req.params.id);

    res.status(204).send();
  }
}
