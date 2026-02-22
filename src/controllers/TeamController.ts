import { Request, Response } from "express";
import { TeamService } from "../services/TeamService";
import { createTeamSchema, updateTeamSchema } from "../schemas/team.schema";

export class TeamController {
  private teamService = new TeamService();

  async findAll(_req: Request, res: Response): Promise<void> {
    const teams = await this.teamService.findAll();

    res.json(teams);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const team = await this.teamService.findById(String(req.params.id));

    res.json(team);
  }

  async create(req: Request, res: Response): Promise<void> {
    const data = createTeamSchema.parse(req.body);
    const team = await this.teamService.create(data);

    res.status(201).json(team);
  }

  async update(req: Request, res: Response): Promise<void> {
    const data = updateTeamSchema.parse(req.body);
    const team = await this.teamService.update(String(req.params.id), data);

    res.json(team);
  }

  async delete(req: Request, res: Response): Promise<void> {
    await this.teamService.delete(String(req.params.id));

    res.status(204).send();
  }
}
