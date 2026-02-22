import { z } from "zod";

const transferTypes = ["buy", "sell", "free", "loan"] as const;

export const createTransferSchema = z.object({
  playerId: z.string().uuid("Player ID must be a valid UUID"),
  fromTeamId: z.string().uuid("From team ID must be a valid UUID").nullish(),
  toTeamId: z.string().uuid("To team ID must be a valid UUID"),
  seasonId: z.string().uuid("Season ID must be a valid UUID"),
  price: z.number().int().min(0, "Price must be non-negative"),
  type: z.enum(transferTypes, { message: "Invalid transfer type" }),
});

export type CreateTransferInput = z.infer<typeof createTransferSchema>;
