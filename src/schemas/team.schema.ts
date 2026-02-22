import { z } from "zod";

export const createTeamSchema = z.object({
  name: z.string().min(1).max(100),
  city: z.string().min(1).max(100),
  stadium: z.string().min(1).max(100),
  foundedYear: z.number().int().min(1800).max(new Date().getFullYear()),
  logoUrl: z.string().url().max(500).optional(),
});

export const updateTeamSchema = createTeamSchema.partial();

export type CreateTeamDTO = z.infer<typeof createTeamSchema>;
export type UpdateTeamDTO = z.infer<typeof updateTeamSchema>;
