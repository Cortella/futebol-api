import { z } from "zod";

export const createMatchSchema = z.object({
  roundId: z.string().uuid("Round ID must be a valid UUID"),
  divisionId: z.string().uuid("Division ID must be a valid UUID"),
  homeTeamId: z.string().uuid("Home team ID must be a valid UUID"),
  awayTeamId: z.string().uuid("Away team ID must be a valid UUID"),
});

export type CreateMatchInput = z.infer<typeof createMatchSchema>;
