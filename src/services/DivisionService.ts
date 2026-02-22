import { AppDataSource } from "../config/data-source";
import { Division } from "../entities/Division";
import { AppError } from "../errors/AppError";
import { CreateDivisionInput, UpdateDivisionInput } from "../schemas/division.schema";

export class DivisionService {
  private get repository() {
    return AppDataSource.getRepository(Division);
  }

  async findAll(): Promise<Division[]> {
    return this.repository.find({
      order: { level: "ASC", name: "ASC" },
      relations: ["championship", "season"],
    });
  }

  async findById(id: string): Promise<Division> {
    const division = await this.repository.findOne({
      where: { id },
      relations: ["championship", "season"],
    });

    if (!division) {
      throw new AppError("Division not found", 404);
    }

    return division;
  }

  async findByChampionship(championshipId: string): Promise<Division[]> {
    return this.repository.find({
      where: { championshipId },
      order: { level: "ASC" },
      relations: ["season"],
    });
  }

  async create(data: CreateDivisionInput): Promise<Division> {
    const totalRounds = (data.totalTeams - 1) * 2;

    const division = this.repository.create({
      ...data,
      totalRounds,
      status: "not_started" as const,
    });

    return this.repository.save(division);
  }

  async update(id: string, data: UpdateDivisionInput): Promise<Division> {
    const division = await this.findById(id);

    const totalTeams = data.totalTeams ?? division.totalTeams;
    const totalRounds = (totalTeams - 1) * 2;

    Object.assign(division, {
      ...data,
      totalRounds,
    });

    return this.repository.save(division);
  }

  async delete(id: string): Promise<void> {
    const division = await this.findById(id);

    await this.repository.remove(division);
  }
}
