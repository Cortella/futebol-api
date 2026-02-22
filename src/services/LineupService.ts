import { AppDataSource } from "../config/data-source";
import { Lineup } from "../entities/Lineup";
import { AppError } from "../errors/AppError";
import { CreateLineupInput, UpdateLineupInput } from "../schemas/lineup.schema";

export class LineupService {
  private get repository() {
    return AppDataSource.getRepository(Lineup);
  }

  async findByCareer(careerId: string): Promise<Lineup[]> {
    return this.repository.find({ where: { careerId }, order: { name: "ASC" } });
  }

  async findById(id: string): Promise<Lineup> {
    const lineup = await this.repository.findOne({ where: { id } });

    if (!lineup) {
      throw new AppError("Lineup not found", 404);
    }

    return lineup;
  }

  async create(data: CreateLineupInput): Promise<Lineup> {
    const lineup = this.repository.create({
      ...data,
      name: data.name ?? null,
    });

    return this.repository.save(lineup);
  }

  async update(id: string, data: UpdateLineupInput): Promise<Lineup> {
    const lineup = await this.findById(id);

    Object.assign(lineup, {
      name: data.name !== undefined ? (data.name ?? null) : lineup.name,
    });

    return this.repository.save(lineup);
  }

  async delete(id: string): Promise<void> {
    const lineup = await this.findById(id);

    await this.repository.remove(lineup);
  }
}
