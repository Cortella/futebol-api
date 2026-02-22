import { Request, Response } from "express";
import { DivisionService } from "../services/DivisionService";
import { createDivisionSchema, updateDivisionSchema } from "../schemas/division.schema";

export class DivisionController {
  private divisionService = new DivisionService();

  async findAll(_req: Request, res: Response): Promise<void> {
    const divisions = await this.divisionService.findAll();

    res.json(divisions);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const division = await this.divisionService.findById(req.params.id);

    res.json(division);
  }

  async findByChampionship(req: Request, res: Response): Promise<void> {
    const divisions = await this.divisionService.findByChampionship(req.params.championshipId);

    res.json(divisions);
  }

  async create(req: Request, res: Response): Promise<void> {
    const data = createDivisionSchema.parse(req.body);
    const division = await this.divisionService.create(data);

    res.status(201).json(division);
  }

  async update(req: Request, res: Response): Promise<void> {
    const data = updateDivisionSchema.parse(req.body);
    const division = await this.divisionService.update(req.params.id, data);

    res.json(division);
  }

  async delete(req: Request, res: Response): Promise<void> {
    await this.divisionService.delete(req.params.id);

    res.status(204).send();
  }
}
