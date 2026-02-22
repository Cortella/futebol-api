import { z } from "zod";

export const createLineupPlayerSchema = z.object({
  lineupId: z.string().uuid("Lineup ID must be a valid UUID"),
  playerId: z.string().uuid("Player ID must be a valid UUID"),
  positionSlot: z.string().min(1, "Position slot is required").max(20),
  isStarter: z.boolean().optional().default(true),
});

export const updateLineupPlayerSchema = z.object({
  positionSlot: z.string().min(1).max(20).optional(),
  isStarter: z.boolean().optional(),
});

export type CreateLineupPlayerInput = z.infer<typeof createLineupPlayerSchema>;
export type UpdateLineupPlayerInput = z.infer<typeof updateLineupPlayerSchema>;
