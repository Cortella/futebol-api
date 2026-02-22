import { AppDataSource } from "../config/data-source";
import { Match } from "../entities/Match";
import { AppError } from "../errors/AppError";
import { CreateMatchInput } from "../schemas/match.schema";

export class MatchService {
  private get repository() {
    return AppDataSource.getRepository(Match);
  }

  async findAll(): Promise<Match[]> {
    return this.repository.find({
      relations: ["homeTeam", "awayTeam", "round"],
    });
  }

  async findByRound(roundId: string): Promise<Match[]> {
    return this.repository.find({
      where: { roundId },
      relations: ["homeTeam", "awayTeam"],
    });
  }

  async findById(id: string): Promise<Match> {
    const match = await this.repository.findOne({
      where: { id },
      relations: ["homeTeam", "awayTeam", "round", "division"],
    });

    if (!match) {
      throw new AppError("Match not found", 404);
    }

    return match;
  }

  async create(data: CreateMatchInput): Promise<Match> {
    const match = this.repository.create(data);

    return this.repository.save(match);
  }

  async delete(id: string): Promise<void> {
    const match = await this.findById(id);

    await this.repository.remove(match);
  }
}
