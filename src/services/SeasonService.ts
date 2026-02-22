import { AppDataSource } from "../config/data-source";
import { Season } from "../entities/Season";
import { AppError } from "../errors/AppError";
import { CreateSeasonInput, UpdateSeasonInput } from "../schemas/season.schema";

export class SeasonService {
  private get repository() {
    return AppDataSource.getRepository(Season);
  }

  async findAll(): Promise<Season[]> {
    return this.repository.find({ order: { year: "DESC" } });
  }

  async findById(id: string): Promise<Season> {
    const season = await this.repository.findOne({ where: { id } });

    if (!season) {
      throw new AppError("Season not found", 404);
    }

    return season;
  }

  async create(data: CreateSeasonInput): Promise<Season> {
    const existing = await this.repository.findOne({ where: { year: data.year } });

    if (existing) {
      throw new AppError("Season year already exists", 409);
    }

    const season = this.repository.create(data);

    return this.repository.save(season);
  }

  async update(id: string, data: UpdateSeasonInput): Promise<Season> {
    const season = await this.findById(id);

    if (data.year && data.year !== season.year) {
      const existing = await this.repository.findOne({ where: { year: data.year } });

      if (existing) {
        throw new AppError("Season year already exists", 409);
      }
    }

    Object.assign(season, data);

    return this.repository.save(season);
  }

  async delete(id: string): Promise<void> {
    const season = await this.findById(id);

    await this.repository.remove(season);
  }
}
