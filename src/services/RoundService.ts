import { AppDataSource } from "../config/data-source";
import { Round } from "../entities/Round";
import { AppError } from "../errors/AppError";
import { CreateRoundInput } from "../schemas/round.schema";

export class RoundService {
  private get repository() {
    return AppDataSource.getRepository(Round);
  }

  async findAll(): Promise<Round[]> {
    return this.repository.find({ order: { number: "ASC" } });
  }

  async findByDivision(divisionId: string): Promise<Round[]> {
    return this.repository.find({
      where: { divisionId },
      order: { number: "ASC" },
    });
  }

  async findById(id: string): Promise<Round> {
    const round = await this.repository.findOne({ where: { id } });

    if (!round) {
      throw new AppError("Round not found", 404);
    }

    return round;
  }

  async findByDivisionAndNumber(divisionId: string, number: number): Promise<Round> {
    const round = await this.repository.findOne({
      where: { divisionId, number },
    });

    if (!round) {
      throw new AppError("Round not found", 404);
    }

    return round;
  }

  async create(data: CreateRoundInput): Promise<Round> {
    const round = this.repository.create(data);

    return this.repository.save(round);
  }

  async delete(id: string): Promise<void> {
    const round = await this.findById(id);

    await this.repository.remove(round);
  }
}
