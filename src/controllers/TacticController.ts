import { Request, Response } from "express";
import { TacticService } from "../services/TacticService";
import { createTacticSchema, updateTacticSchema } from "../schemas/tactic.schema";

export class TacticController {
  private tacticService = new TacticService();

  async findByCareer(req: Request, res: Response): Promise<void> {
    const tactic = await this.tacticService.findByCareer(req.params.careerId);

    res.json(tactic);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const tactic = await this.tacticService.findById(req.params.id);

    res.json(tactic);
  }

  async create(req: Request, res: Response): Promise<void> {
    const data = createTacticSchema.parse(req.body);
    const tactic = await this.tacticService.create(data);

    res.status(201).json(tactic);
  }

  async update(req: Request, res: Response): Promise<void> {
    const data = updateTacticSchema.parse(req.body);
    const tactic = await this.tacticService.update(req.params.id, data);

    res.json(tactic);
  }

  async delete(req: Request, res: Response): Promise<void> {
    await this.tacticService.delete(req.params.id);

    res.status(204).send();
  }
}
