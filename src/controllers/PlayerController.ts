import { Request, Response } from "express";
import { PlayerService } from "../services/PlayerService";
import { createPlayerSchema, updatePlayerSchema } from "../schemas/player.schema";

const playerService = new PlayerService();

export class PlayerController {
  async index(_req: Request, res: Response): Promise<void> {
    const players = await playerService.findAll();
    res.json(players);
  }

  async show(req: Request<{ id: string }>, res: Response): Promise<void> {
    const player = await playerService.findById(req.params.id);
    res.json(player);
  }

  async byTeam(req: Request<{ teamId: string }>, res: Response): Promise<void> {
    const players = await playerService.findByTeam(req.params.teamId);
    res.json(players);
  }

  async store(req: Request, res: Response): Promise<void> {
    const data = createPlayerSchema.parse(req.body);
    const player = await playerService.create(data);
    res.status(201).json(player);
  }

  async update(req: Request<{ id: string }>, res: Response): Promise<void> {
    const data = updatePlayerSchema.parse(req.body);
    const player = await playerService.update(req.params.id, data);
    res.json(player);
  }

  async destroy(req: Request<{ id: string }>, res: Response): Promise<void> {
    await playerService.delete(req.params.id);
    res.status(204).send();
  }
}
