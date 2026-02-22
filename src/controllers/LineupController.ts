import { Request, Response } from "express";
import { LineupService } from "../services/LineupService";
import { createLineupSchema, updateLineupSchema } from "../schemas/lineup.schema";

export class LineupController {
  private lineupService = new LineupService();

  async findByCareer(req: Request, res: Response): Promise<void> {
    const lineups = await this.lineupService.findByCareer(req.params.careerId);

    res.json(lineups);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const lineup = await this.lineupService.findById(req.params.id);

    res.json(lineup);
  }

  async create(req: Request, res: Response): Promise<void> {
    const data = createLineupSchema.parse(req.body);
    const lineup = await this.lineupService.create(data);

    res.status(201).json(lineup);
  }

  async update(req: Request, res: Response): Promise<void> {
    const data = updateLineupSchema.parse(req.body);
    const lineup = await this.lineupService.update(req.params.id, data);

    res.json(lineup);
  }

  async delete(req: Request, res: Response): Promise<void> {
    await this.lineupService.delete(req.params.id);

    res.status(204).send();
  }
}
