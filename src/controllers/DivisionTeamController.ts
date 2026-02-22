import { Request, Response } from "express";
import { DivisionTeamService } from "../services/DivisionTeamService";
import { createDivisionTeamSchema, updateDivisionTeamSchema } from "../schemas/divisionTeam.schema";

export class DivisionTeamController {
  private divisionTeamService = new DivisionTeamService();

  async findAll(_req: Request, res: Response): Promise<void> {
    const divisionTeams = await this.divisionTeamService.findAll();

    res.json(divisionTeams);
  }

  async findByDivision(req: Request, res: Response): Promise<void> {
    const divisionTeams = await this.divisionTeamService.findByDivision(req.params.divisionId);

    res.json(divisionTeams);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const divisionTeam = await this.divisionTeamService.findById(req.params.id);

    res.json(divisionTeam);
  }

  async create(req: Request, res: Response): Promise<void> {
    const data = createDivisionTeamSchema.parse(req.body);
    const divisionTeam = await this.divisionTeamService.create(data);

    res.status(201).json(divisionTeam);
  }

  async update(req: Request, res: Response): Promise<void> {
    const data = updateDivisionTeamSchema.parse(req.body);
    const divisionTeam = await this.divisionTeamService.update(req.params.id, data);

    res.json(divisionTeam);
  }

  async delete(req: Request, res: Response): Promise<void> {
    await this.divisionTeamService.delete(req.params.id);

    res.status(204).send();
  }
}
