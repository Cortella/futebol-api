import { z } from "zod";

export const createLineupSchema = z.object({
  careerId: z.string().uuid("Career ID must be a valid UUID"),
  name: z.string().max(100).nullish(),
});

export const updateLineupSchema = z.object({
  name: z.string().max(100).nullish(),
});

export type CreateLineupInput = z.infer<typeof createLineupSchema>;
export type UpdateLineupInput = z.infer<typeof updateLineupSchema>;
