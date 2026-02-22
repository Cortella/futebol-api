import { z } from "zod";

export const createStandingSchema = z.object({
  divisionId: z.string().uuid("Division ID must be a valid UUID"),
  teamId: z.string().uuid("Team ID must be a valid UUID"),
});

export type CreateStandingInput = z.infer<typeof createStandingSchema>;
