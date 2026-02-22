import { Request, Response } from "express";
import { PlayerService } from "../services/PlayerService";
import { createPlayerSchema, updatePlayerSchema } from "../schemas/player.schema";

export class PlayerController {
  private playerService = new PlayerService();

  async findAll(_req: Request, res: Response): Promise<void> {
    const players = await this.playerService.findAll();

    res.json(players);
  }

  async findByTeam(req: Request, res: Response): Promise<void> {
    const players = await this.playerService.findByTeam(req.params.teamId);

    res.json(players);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const player = await this.playerService.findById(req.params.id);

    res.json(player);
  }

  async create(req: Request, res: Response): Promise<void> {
    const data = createPlayerSchema.parse(req.body);
    const player = await this.playerService.create(data);

    res.status(201).json(player);
  }

  async update(req: Request, res: Response): Promise<void> {
    const data = updatePlayerSchema.parse(req.body);
    const player = await this.playerService.update(req.params.id, data);

    res.json(player);
  }

  async delete(req: Request, res: Response): Promise<void> {
    await this.playerService.delete(req.params.id);

    res.status(204).send();
  }
}
