import { AppDataSource } from "../config/data-source";
import { Team } from "../entities/Team";
import { AppError } from "../errors/AppError";
import { CreateTeamInput, UpdateTeamInput } from "../schemas/team.schema";

export class TeamService {
  private get repository() {
    return AppDataSource.getRepository(Team);
  }

  async findAll(): Promise<Team[]> {
    return this.repository.find({ order: { name: "ASC" } });
  }

  async findById(id: string): Promise<Team> {
    const team = await this.repository.findOne({ where: { id } });

    if (!team) {
      throw new AppError("Team not found", 404);
    }

    return team;
  }

  async create(data: CreateTeamInput): Promise<Team> {
    const existingByName = await this.repository.findOne({ where: { name: data.name } });

    if (existingByName) {
      throw new AppError("Team name already in use", 409);
    }

    const existingByShortName = await this.repository.findOne({
      where: { shortName: data.shortName },
    });

    if (existingByShortName) {
      throw new AppError("Short name already in use", 409);
    }

    const team = this.repository.create({
      ...data,
      baseWage: String(data.baseWage),
    });

    return this.repository.save(team);
  }

  async update(id: string, data: UpdateTeamInput): Promise<Team> {
    const team = await this.findById(id);

    if (data.name && data.name !== team.name) {
      const existingByName = await this.repository.findOne({ where: { name: data.name } });

      if (existingByName) {
        throw new AppError("Team name already in use", 409);
      }
    }

    if (data.shortName && data.shortName !== team.shortName) {
      const existingByShortName = await this.repository.findOne({
        where: { shortName: data.shortName },
      });

      if (existingByShortName) {
        throw new AppError("Short name already in use", 409);
      }
    }

    Object.assign(team, {
      ...data,
      baseWage: data.baseWage !== undefined ? String(data.baseWage) : team.baseWage,
    });

    return this.repository.save(team);
  }

  async delete(id: string): Promise<void> {
    const team = await this.findById(id);

    await this.repository.remove(team);
  }
}
