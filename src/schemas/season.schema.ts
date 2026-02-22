import { z } from "zod";

export const createSeasonSchema = z.object({
  year: z.number().int().min(2000, "Year must be at least 2000").max(2100, "Year max is 2100"),
});

export const updateSeasonSchema = createSeasonSchema.partial();

export type CreateSeasonInput = z.infer<typeof createSeasonSchema>;
export type UpdateSeasonInput = z.infer<typeof updateSeasonSchema>;
