import { AppDataSource } from "../config/data-source";
import { DivisionTeam } from "../entities/DivisionTeam";
import { AppError } from "../errors/AppError";
import { CreateDivisionTeamInput, UpdateDivisionTeamInput } from "../schemas/divisionTeam.schema";

export class DivisionTeamService {
  private get repository() {
    return AppDataSource.getRepository(DivisionTeam);
  }

  async findAll(): Promise<DivisionTeam[]> {
    return this.repository.find({ relations: ["division", "team"] });
  }

  async findByDivision(divisionId: string): Promise<DivisionTeam[]> {
    return this.repository.find({
      where: { divisionId },
      relations: ["team"],
    });
  }

  async findById(id: string): Promise<DivisionTeam> {
    const divisionTeam = await this.repository.findOne({
      where: { id },
      relations: ["division", "team"],
    });

    if (!divisionTeam) {
      throw new AppError("DivisionTeam not found", 404);
    }

    return divisionTeam;
  }

  async create(data: CreateDivisionTeamInput): Promise<DivisionTeam> {
    const existing = await this.repository.findOne({
      where: { divisionId: data.divisionId, teamId: data.teamId },
    });

    if (existing) {
      throw new AppError("Team already assigned to this division", 409);
    }

    const divisionTeam = this.repository.create(data);

    return this.repository.save(divisionTeam);
  }

  async update(id: string, data: UpdateDivisionTeamInput): Promise<DivisionTeam> {
    const divisionTeam = await this.findById(id);

    Object.assign(divisionTeam, data);

    return this.repository.save(divisionTeam);
  }

  async delete(id: string): Promise<void> {
    const divisionTeam = await this.findById(id);

    await this.repository.remove(divisionTeam);
  }
}
