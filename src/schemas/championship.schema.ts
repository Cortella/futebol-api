import { z } from "zod";

export const createChampionshipSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  country: z.string().min(1, "Country is required").max(100),
  logo: z.string().url("Logo must be a valid URL").nullish(),
});

export const updateChampionshipSchema = createChampionshipSchema.partial();

export type CreateChampionshipInput = z.infer<typeof createChampionshipSchema>;
export type UpdateChampionshipInput = z.infer<typeof updateChampionshipSchema>;
