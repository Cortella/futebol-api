import { AppDataSource } from "../config/data-source";
import { Team } from "../entities/Team";
import { AppError } from "../errors/AppError";
import { CreateTeamDTO, UpdateTeamDTO } from "../schemas/team.schema";

const teamRepository = AppDataSource.getRepository(Team);

export class TeamService {
  async findAll(): Promise<Team[]> {
    return teamRepository.find({ relations: ["players"] });
  }

  async findById(id: string): Promise<Team> {
    const team = await teamRepository.findOne({
      where: { id },
      relations: ["players"],
    });

    if (!team) {
      throw new AppError("Team not found", 404);
    }

    return team;
  }

  async create(data: CreateTeamDTO): Promise<Team> {
    const team = teamRepository.create(data);

    return teamRepository.save(team);
  }

  async update(id: string, data: UpdateTeamDTO): Promise<Team> {
    const team = await this.findById(id);
    Object.assign(team, data);

    return teamRepository.save(team);
  }

  async delete(id: string): Promise<void> {
    const team = await this.findById(id);
    await teamRepository.remove(team);
  }
}
