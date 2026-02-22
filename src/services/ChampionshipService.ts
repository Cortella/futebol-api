import { AppDataSource } from "../config/data-source";
import { Championship } from "../entities/Championship";
import { AppError } from "../errors/AppError";
import { CreateChampionshipInput, UpdateChampionshipInput } from "../schemas/championship.schema";

export class ChampionshipService {
  private get repository() {
    return AppDataSource.getRepository(Championship);
  }

  async findAll(): Promise<Championship[]> {
    return this.repository.find({ order: { name: "ASC" } });
  }

  async findById(id: string): Promise<Championship> {
    const championship = await this.repository.findOne({ where: { id } });

    if (!championship) {
      throw new AppError("Championship not found", 404);
    }

    return championship;
  }

  async create(data: CreateChampionshipInput): Promise<Championship> {
    const existing = await this.repository.findOne({ where: { name: data.name } });

    if (existing) {
      throw new AppError("Championship name already in use", 409);
    }

    const championship = this.repository.create({
      ...data,
      logo: data.logo ?? null,
    });

    return this.repository.save(championship);
  }

  async update(id: string, data: UpdateChampionshipInput): Promise<Championship> {
    const championship = await this.findById(id);

    if (data.name && data.name !== championship.name) {
      const existing = await this.repository.findOne({ where: { name: data.name } });

      if (existing) {
        throw new AppError("Championship name already in use", 409);
      }
    }

    Object.assign(championship, {
      ...data,
      logo: data.logo !== undefined ? (data.logo ?? null) : championship.logo,
    });

    return this.repository.save(championship);
  }

  async delete(id: string): Promise<void> {
    const championship = await this.findById(id);

    await this.repository.remove(championship);
  }
}
