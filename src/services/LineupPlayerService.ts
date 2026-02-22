import { AppDataSource } from "../config/data-source";
import { LineupPlayer } from "../entities/LineupPlayer";
import { AppError } from "../errors/AppError";
import { CreateLineupPlayerInput, UpdateLineupPlayerInput } from "../schemas/lineupPlayer.schema";

export class LineupPlayerService {
  private get repository() {
    return AppDataSource.getRepository(LineupPlayer);
  }

  async findByLineup(lineupId: string): Promise<LineupPlayer[]> {
    return this.repository.find({
      where: { lineupId },
      relations: ["player"],
      order: { positionSlot: "ASC" },
    });
  }

  async findById(id: string): Promise<LineupPlayer> {
    const lineupPlayer = await this.repository.findOne({
      where: { id },
      relations: ["player"],
    });

    if (!lineupPlayer) {
      throw new AppError("LineupPlayer not found", 404);
    }

    return lineupPlayer;
  }

  async create(data: CreateLineupPlayerInput): Promise<LineupPlayer> {
    const lineupPlayer = this.repository.create(data);

    return this.repository.save(lineupPlayer);
  }

  async update(id: string, data: UpdateLineupPlayerInput): Promise<LineupPlayer> {
    const lineupPlayer = await this.findById(id);

    Object.assign(lineupPlayer, data);

    return this.repository.save(lineupPlayer);
  }

  async delete(id: string): Promise<void> {
    const lineupPlayer = await this.findById(id);

    await this.repository.remove(lineupPlayer);
  }
}
