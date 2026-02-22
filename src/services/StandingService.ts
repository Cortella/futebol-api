import { AppDataSource } from "../config/data-source";
import { Standing } from "../entities/Standing";
import { AppError } from "../errors/AppError";
import { CreateStandingInput } from "../schemas/standing.schema";

export class StandingService {
  private get repository() {
    return AppDataSource.getRepository(Standing);
  }

  async findByDivision(divisionId: string): Promise<Standing[]> {
    return this.repository.find({
      where: { divisionId },
      relations: ["team"],
      order: { position: "ASC" },
    });
  }

  async findById(id: string): Promise<Standing> {
    const standing = await this.repository.findOne({
      where: { id },
      relations: ["team"],
    });

    if (!standing) {
      throw new AppError("Standing not found", 404);
    }

    return standing;
  }

  async create(data: CreateStandingInput): Promise<Standing> {
    const standing = this.repository.create(data);

    return this.repository.save(standing);
  }

  async delete(id: string): Promise<void> {
    const standing = await this.findById(id);

    await this.repository.remove(standing);
  }
}
