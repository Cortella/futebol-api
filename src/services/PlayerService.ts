import { AppDataSource } from "../config/data-source";
import { Player } from "../entities/Player";
import { AppError } from "../errors/AppError";
import { CreatePlayerInput, UpdatePlayerInput } from "../schemas/player.schema";

export class PlayerService {
  private get repository() {
    return AppDataSource.getRepository(Player);
  }

  async findAll(): Promise<Player[]> {
    return this.repository.find({ order: { name: "ASC" }, relations: ["team"] });
  }

  async findByTeam(teamId: string): Promise<Player[]> {
    return this.repository.find({
      where: { teamId },
      order: { position: "ASC", name: "ASC" },
    });
  }

  async findById(id: string): Promise<Player> {
    const player = await this.repository.findOne({ where: { id }, relations: ["team"] });

    if (!player) {
      throw new AppError("Player not found", 404);
    }

    return player;
  }

  async create(data: CreatePlayerInput): Promise<Player> {
    const player = this.repository.create({
      ...data,
      nickname: data.nickname ?? null,
      teamId: data.teamId ?? null,
      shirtNumber: data.shirtNumber ?? null,
      salary: String(data.salary),
      marketValue: String(data.marketValue),
    });

    return this.repository.save(player);
  }

  async update(id: string, data: UpdatePlayerInput): Promise<Player> {
    const player = await this.findById(id);

    const updateData: Record<string, unknown> = { ...data };

    if (data.salary !== undefined) {
      updateData.salary = String(data.salary);
    }

    if (data.marketValue !== undefined) {
      updateData.marketValue = String(data.marketValue);
    }

    if (data.nickname !== undefined) {
      updateData.nickname = data.nickname ?? null;
    }

    if (data.teamId !== undefined) {
      updateData.teamId = data.teamId ?? null;
    }

    if (data.shirtNumber !== undefined) {
      updateData.shirtNumber = data.shirtNumber ?? null;
    }

    Object.assign(player, updateData);

    return this.repository.save(player);
  }

  async delete(id: string): Promise<void> {
    const player = await this.findById(id);

    await this.repository.remove(player);
  }
}
