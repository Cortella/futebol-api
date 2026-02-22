import { AppDataSource } from "../config/data-source";
import { Tactic } from "../entities/Tactic";
import { AppError } from "../errors/AppError";
import { CreateTacticInput, UpdateTacticInput } from "../schemas/tactic.schema";

export class TacticService {
  private get repository() {
    return AppDataSource.getRepository(Tactic);
  }

  async findByCareer(careerId: string): Promise<Tactic | null> {
    return this.repository.findOne({ where: { careerId } });
  }

  async findById(id: string): Promise<Tactic> {
    const tactic = await this.repository.findOne({ where: { id } });

    if (!tactic) {
      throw new AppError("Tactic not found", 404);
    }

    return tactic;
  }

  async create(data: CreateTacticInput): Promise<Tactic> {
    const existing = await this.repository.findOne({ where: { careerId: data.careerId } });

    if (existing) {
      throw new AppError("Tactic already exists for this career", 409);
    }

    const tactic = this.repository.create(data);

    return this.repository.save(tactic);
  }

  async update(id: string, data: UpdateTacticInput): Promise<Tactic> {
    const tactic = await this.findById(id);

    Object.assign(tactic, data);

    return this.repository.save(tactic);
  }

  async updateByCareer(careerId: string, data: UpdateTacticInput): Promise<Tactic> {
    let tactic = await this.repository.findOne({ where: { careerId } });

    if (!tactic) {
      tactic = this.repository.create({ careerId, ...data });
    } else {
      Object.assign(tactic, data);
    }

    return this.repository.save(tactic);
  }

  async delete(id: string): Promise<void> {
    const tactic = await this.findById(id);

    await this.repository.remove(tactic);
  }
}
