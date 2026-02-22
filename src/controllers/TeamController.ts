import { Request, Response } from "express";
import { TeamService } from "../services/TeamService";
import { createTeamSchema, updateTeamSchema } from "../schemas/team.schema";

const teamService = new TeamService();

export class TeamController {
  async index(_req: Request, res: Response): Promise<void> {
    const teams = await teamService.findAll();
    res.json(teams);
  }

  async show(req: Request<{ id: string }>, res: Response): Promise<void> {
    const team = await teamService.findById(req.params.id);
    res.json(team);
  }

  async store(req: Request, res: Response): Promise<void> {
    const data = createTeamSchema.parse(req.body);
    const team = await teamService.create(data);
    res.status(201).json(team);
  }

  async update(req: Request<{ id: string }>, res: Response): Promise<void> {
    const data = updateTeamSchema.parse(req.body);
    const team = await teamService.update(req.params.id, data);
    res.json(team);
  }

  async destroy(req: Request<{ id: string }>, res: Response): Promise<void> {
    await teamService.delete(req.params.id);
    res.status(204).send();
  }
}
