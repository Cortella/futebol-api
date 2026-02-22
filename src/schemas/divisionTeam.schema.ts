import { z } from "zod";

export const createDivisionTeamSchema = z.object({
  divisionId: z.string().uuid("Division ID must be a valid UUID"),
  teamId: z.string().uuid("Team ID must be a valid UUID"),
  isUserTeam: z.boolean().optional().default(false),
});

export const updateDivisionTeamSchema = z.object({
  isUserTeam: z.boolean().optional(),
});

export type CreateDivisionTeamInput = z.infer<typeof createDivisionTeamSchema>;
export type UpdateDivisionTeamInput = z.infer<typeof updateDivisionTeamSchema>;
