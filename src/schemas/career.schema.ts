import { z } from "zod";

export const createCareerSchema = z.object({
  championshipId: z.string().uuid("Championship ID must be a valid UUID"),
  teamId: z.string().uuid("Team ID must be a valid UUID"),
});

export type CreateCareerInput = z.infer<typeof createCareerSchema>;
