import { z } from "zod";

export const createDivisionSchema = z.object({
  championshipId: z.string().uuid("Championship ID must be a valid UUID"),
  seasonId: z.string().uuid("Season ID must be a valid UUID"),
  name: z.string().min(1, "Name is required").max(100),
  level: z.number().int().min(1, "Level must be at least 1").max(4, "Level max is 4"),
  totalTeams: z.number().int().min(2, "Must have at least 2 teams"),
  promotionSlots: z.number().int().min(0, "Promotion slots must be non-negative"),
  relegationSlots: z.number().int().min(0, "Relegation slots must be non-negative"),
});

export const updateDivisionSchema = createDivisionSchema
  .omit({ championshipId: true, seasonId: true })
  .partial();

export type CreateDivisionInput = z.infer<typeof createDivisionSchema>;
export type UpdateDivisionInput = z.infer<typeof updateDivisionSchema>;
