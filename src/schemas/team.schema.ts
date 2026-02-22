import { z } from "zod";

export const createTeamSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  shortName: z
    .string()
    .length(3, "Short name must be exactly 3 characters")
    .regex(/^[A-Z]+$/, "Short name must be uppercase letters only"),
  city: z.string().min(1, "City is required").max(100),
  state: z
    .string()
    .length(2, "State must be exactly 2 characters")
    .regex(/^[A-Z]+$/, "State must be uppercase letters only"),
  stadium: z.string().min(1, "Stadium is required").max(100),
  stadiumCapacity: z.number().int().min(1, "Stadium capacity must be at least 1"),
  colors: z.string().min(1, "Colors is required").max(100),
  logo: z.string().url("Logo must be a valid URL").nullish(),
  prestige: z.number().int().min(1, "Prestige must be at least 1").max(100, "Prestige max is 100"),
  baseWage: z.number().int().min(0, "Base wage must be non-negative"),
});

export const updateTeamSchema = createTeamSchema.partial();

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
