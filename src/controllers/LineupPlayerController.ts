import { Request, Response } from "express";
import { LineupPlayerService } from "../services/LineupPlayerService";
import { createLineupPlayerSchema, updateLineupPlayerSchema } from "../schemas/lineupPlayer.schema";

export class LineupPlayerController {
  private lineupPlayerService = new LineupPlayerService();

  async findByLineup(req: Request, res: Response): Promise<void> {
    const lineupPlayers = await this.lineupPlayerService.findByLineup(String(req.params.lineupId));

    res.json(lineupPlayers);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const lineupPlayer = await this.lineupPlayerService.findById(String(req.params.id));

    res.json(lineupPlayer);
  }

  async create(req: Request, res: Response): Promise<void> {
    const data = createLineupPlayerSchema.parse(req.body);
    const lineupPlayer = await this.lineupPlayerService.create(data);

    res.status(201).json(lineupPlayer);
  }

  async update(req: Request, res: Response): Promise<void> {
    const data = updateLineupPlayerSchema.parse(req.body);
    const lineupPlayer = await this.lineupPlayerService.update(String(req.params.id), data);

    res.json(lineupPlayer);
  }

  async delete(req: Request, res: Response): Promise<void> {
    await this.lineupPlayerService.delete(String(req.params.id));

    res.status(204).send();
  }
}
