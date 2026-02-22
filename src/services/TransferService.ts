import { AppDataSource } from "../config/data-source";
import { Transfer } from "../entities/Transfer";
import { AppError } from "../errors/AppError";
import { CreateTransferInput } from "../schemas/transfer.schema";

export class TransferService {
  private get repository() {
    return AppDataSource.getRepository(Transfer);
  }

  async findAll(): Promise<Transfer[]> {
    return this.repository.find({
      relations: ["player", "fromTeam", "toTeam", "season"],
      order: { date: "DESC" },
    });
  }

  async findBySeason(seasonId: string): Promise<Transfer[]> {
    return this.repository.find({
      where: { seasonId },
      relations: ["player", "fromTeam", "toTeam"],
      order: { date: "DESC" },
    });
  }

  async findBySeasonAndTeam(seasonId: string, teamId: string): Promise<Transfer[]> {
    return this.repository.find({
      where: [
        { seasonId, fromTeamId: teamId },
        { seasonId, toTeamId: teamId },
      ],
      relations: ["player", "fromTeam", "toTeam"],
      order: { date: "DESC" },
    });
  }

  async findById(id: string): Promise<Transfer> {
    const transfer = await this.repository.findOne({
      where: { id },
      relations: ["player", "fromTeam", "toTeam", "season"],
    });

    if (!transfer) {
      throw new AppError("Transfer not found", 404);
    }

    return transfer;
  }

  async create(data: CreateTransferInput): Promise<Transfer> {
    const transfer = this.repository.create({
      ...data,
      fromTeamId: data.fromTeamId ?? null,
      price: String(data.price),
    });

    return this.repository.save(transfer);
  }

  async delete(id: string): Promise<void> {
    const transfer = await this.findById(id);

    await this.repository.remove(transfer);
  }
}
