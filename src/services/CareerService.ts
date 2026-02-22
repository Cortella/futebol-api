import { AppDataSource } from "../config/data-source";
import { Career } from "../entities/Career";
import { Team } from "../entities/Team";
import { Division } from "../entities/Division";
import { Season } from "../entities/Season";
import { AppError } from "../errors/AppError";
import { CreateCareerInput } from "../schemas/career.schema";

export class CareerService {
  private get careerRepository() {
    return AppDataSource.getRepository(Career);
  }

  private get teamRepository() {
    return AppDataSource.getRepository(Team);
  }

  private get divisionRepository() {
    return AppDataSource.getRepository(Division);
  }

  private get seasonRepository() {
    return AppDataSource.getRepository(Season);
  }

  async findAllByUser(userId: string): Promise<Career[]> {
    return this.careerRepository.find({
      where: { userId },
      relations: ["team", "season", "division"],
      order: { createdAt: "DESC" },
    });
  }

  async findById(id: string, userId: string): Promise<Career> {
    const career = await this.careerRepository.findOne({
      where: { id },
      relations: ["team", "season", "division", "division.championship"],
    });

    if (!career) {
      throw new AppError("Career not found", 404);
    }

    if (career.userId !== userId) {
      throw new AppError("You can only manage your own career", 403);
    }

    return career;
  }

  async create(userId: string, data: CreateCareerInput): Promise<Career> {
    const team = await this.teamRepository.findOne({ where: { id: data.teamId } });

    if (!team) {
      throw new AppError("Team not found", 404);
    }

    const division = await this.divisionRepository.findOne({
      where: { championshipId: data.championshipId },
      order: { level: "ASC" },
    });

    if (!division) {
      throw new AppError("No division found for this championship", 404);
    }

    const season = await this.seasonRepository.findOne({
      where: { id: division.seasonId },
    });

    if (!season) {
      throw new AppError("Season not found", 404);
    }

    const initialBudget = String(team.prestige * 100000000);

    const career = this.careerRepository.create({
      userId,
      teamId: data.teamId,
      seasonId: season.id,
      divisionId: division.id,
      currentRound: 1,
      budget: initialBudget,
      reputation: Math.min(team.prestige, 100),
      status: "active" as const,
    });

    return this.careerRepository.save(career);
  }

  async delete(id: string, userId: string): Promise<void> {
    const career = await this.findById(id, userId);

    await this.careerRepository.remove(career);
  }
}
