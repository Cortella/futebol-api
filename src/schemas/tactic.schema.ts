import { z } from "zod";

const validFormations = [
  "3-5-2",
  "3-4-3",
  "4-4-2",
  "4-3-3",
  "4-5-1",
  "4-2-3-1",
  "4-3-2-1",
  "4-1-3-2",
  "5-4-1",
  "5-3-2",
  "3-4-1-2",
  "3-3-3-1",
  "4-2-4",
  "4-1-4-1",
] as const;

const styles = [
  "ultra_defensive",
  "defensive",
  "moderate",
  "offensive",
  "ultra_offensive",
] as const;
const markings = ["zone", "man_to_man"] as const;
const tempos = ["slow", "normal", "fast"] as const;
const passings = ["short", "mixed", "long"] as const;
const pressures = ["low", "normal", "high"] as const;

export const createTacticSchema = z.object({
  careerId: z.string().uuid("Career ID must be a valid UUID"),
  formation: z.enum(validFormations, { message: "Invalid formation" }).optional().default("4-4-2"),
  style: z.enum(styles, { message: "Invalid style" }).optional().default("moderate"),
  marking: z.enum(markings, { message: "Invalid marking" }).optional().default("zone"),
  tempo: z.enum(tempos, { message: "Invalid tempo" }).optional().default("normal"),
  passing: z.enum(passings, { message: "Invalid passing" }).optional().default("mixed"),
  pressure: z.enum(pressures, { message: "Invalid pressure" }).optional().default("normal"),
});

export const updateTacticSchema = createTacticSchema.omit({ careerId: true }).partial();

export type CreateTacticInput = z.infer<typeof createTacticSchema>;
export type UpdateTacticInput = z.infer<typeof updateTacticSchema>;
