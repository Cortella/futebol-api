import { z } from "zod";

export const createPlayerSchema = z.object({
  name: z.string().min(1).max(100),
  position: z.string().min(1).max(50),
  number: z.number().int().min(1).max(99),
  nationality: z.string().min(1).max(50),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD"),
  teamId: z.string().uuid().optional(),
});

export const updatePlayerSchema = createPlayerSchema.partial();

export type CreatePlayerDTO = z.infer<typeof createPlayerSchema>;
export type UpdatePlayerDTO = z.infer<typeof updatePlayerSchema>;
