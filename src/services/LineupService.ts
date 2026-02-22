import { AppDataSource } from "../config/data-source";
import { Lineup } from "../entities/Lineup";
import { LineupPlayer } from "../entities/LineupPlayer";
import { AppError } from "../errors/AppError";
import { CreateLineupInput, UpdateLineupInput } from "../schemas/lineup.schema";
import { UpdateCareerLineupInput } from "../schemas/careerGame.schema";

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

  async getLineupWithPlayers(
    careerId: string,
  ): Promise<{ lineup: Lineup; players: LineupPlayer[] } | null> {
    const lineup = await this.repository.findOne({ where: { careerId } });

    if (!lineup) {
      return null;
    }

    const lineupPlayerRepo = AppDataSource.getRepository(LineupPlayer);
    const players = await lineupPlayerRepo.find({
      where: { lineupId: lineup.id },
      relations: ["player"],
      order: { isStarter: "DESC", positionSlot: "ASC" },
    });

    return { lineup, players };
  }

  async setLineup(
    careerId: string,
    data: UpdateCareerLineupInput,
  ): Promise<{ lineup: Lineup; players: LineupPlayer[] }> {
    const lineupPlayerRepo = AppDataSource.getRepository(LineupPlayer);

    let lineup = await this.repository.findOne({ where: { careerId } });

    if (!lineup) {
      lineup = this.repository.create({ careerId, name: data.name ?? null });
      lineup = await this.repository.save(lineup);
    } else {
      if (data.name !== undefined) {
        lineup.name = data.name ?? null;
        lineup = await this.repository.save(lineup);
      }
    }

    await lineupPlayerRepo.delete({ lineupId: lineup.id });

    const players: LineupPlayer[] = [];

    for (const s of data.starters) {
      const lp = lineupPlayerRepo.create({
        lineupId: lineup.id,
        playerId: s.playerId,
        positionSlot: s.positionSlot,
        isStarter: true,
      });
      players.push(lp);
    }

    for (const r of data.reserves) {
      const lp = lineupPlayerRepo.create({
        lineupId: lineup.id,
        playerId: r.playerId,
        positionSlot: r.positionSlot,
        isStarter: false,
      });
      players.push(lp);
    }

    const savedPlayers = await lineupPlayerRepo.save(players);

    return { lineup, players: savedPlayers };
  }
}
