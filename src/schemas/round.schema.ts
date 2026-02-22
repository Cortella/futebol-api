import { z } from "zod";

export const createRoundSchema = z.object({
  divisionId: z.string().uuid("Division ID must be a valid UUID"),
  seasonId: z.string().uuid("Season ID must be a valid UUID"),
  number: z.number().int().min(1, "Round number must be at least 1"),
});

export type CreateRoundInput = z.infer<typeof createRoundSchema>;
