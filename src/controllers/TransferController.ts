import { Request, Response } from "express";
import { TransferService } from "../services/TransferService";
import { createTransferSchema } from "../schemas/transfer.schema";

export class TransferController {
  private transferService = new TransferService();

  async findAll(_req: Request, res: Response): Promise<void> {
    const transfers = await this.transferService.findAll();

    res.json(transfers);
  }

  async findBySeason(req: Request, res: Response): Promise<void> {
    const transfers = await this.transferService.findBySeason(req.params.seasonId);

    res.json(transfers);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const transfer = await this.transferService.findById(req.params.id);

    res.json(transfer);
  }

  async create(req: Request, res: Response): Promise<void> {
    const data = createTransferSchema.parse(req.body);
    const transfer = await this.transferService.create(data);

    res.status(201).json(transfer);
  }

  async delete(req: Request, res: Response): Promise<void> {
    await this.transferService.delete(req.params.id);

    res.status(204).send();
  }
}
