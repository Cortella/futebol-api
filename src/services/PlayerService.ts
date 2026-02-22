import { AppDataSource } from "../config/data-source";
import { Player } from "../entities/Player";
import { AppError } from "../errors/AppError";
import { CreatePlayerDTO, UpdatePlayerDTO } from "../schemas/player.schema";

const playerRepository = AppDataSource.getRepository(Player);

export class PlayerService {
  async findAll(): Promise<Player[]> {
    return playerRepository.find({ relations: ["team"] });
  }

  async findById(id: string): Promise<Player> {
    const player = await playerRepository.findOne({
      where: { id },
      relations: ["team"],
    });

    if (!player) {
      throw new AppError("Player not found", 404);
    }

    return player;
  }

  async findByTeam(teamId: string): Promise<Player[]> {
    return playerRepository.find({
      where: { teamId },
      relations: ["team"],
    });
  }

  async create(data: CreatePlayerDTO): Promise<Player> {
    const player = playerRepository.create(data);

    return playerRepository.save(player);
  }

  async update(id: string, data: UpdatePlayerDTO): Promise<Player> {
    const player = await this.findById(id);
    Object.assign(player, data);

    return playerRepository.save(player);
  }

  async delete(id: string): Promise<void> {
    const player = await this.findById(id);
    await playerRepository.remove(player);
  }
}
