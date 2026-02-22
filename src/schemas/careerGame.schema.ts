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

export const updateCareerTacticSchema = z.object({
  formation: z.enum(validFormations, { message: "Invalid formation" }).optional(),
  style: z.enum(styles, { message: "Invalid style" }).optional(),
  marking: z.enum(markings, { message: "Invalid marking" }).optional(),
  tempo: z.enum(tempos, { message: "Invalid tempo" }).optional(),
  passing: z.enum(passings, { message: "Invalid passing" }).optional(),
  pressure: z.enum(pressures, { message: "Invalid pressure" }).optional(),
});

export type UpdateCareerTacticInput = z.infer<typeof updateCareerTacticSchema>;

const lineupPlayerEntry = z.object({
  playerId: z.string().uuid("Player ID must be a valid UUID"),
  positionSlot: z.string().min(1).max(10),
});

export const updateCareerLineupSchema = z.object({
  name: z.string().max(50).optional().nullable(),
  starters: z.array(lineupPlayerEntry).length(11, "Must have exactly 11 starters"),
  reserves: z.array(lineupPlayerEntry).max(12, "Maximum 12 reserves").optional().default([]),
});

export type UpdateCareerLineupInput = z.infer<typeof updateCareerLineupSchema>;

export const buyPlayerSchema = z.object({
  playerId: z.string().uuid("Player ID must be a valid UUID"),
  offerPrice: z.number().int().min(0, "Offer price must be non-negative"),
});

export type BuyPlayerInput = z.infer<typeof buyPlayerSchema>;

export const sellPlayerSchema = z.object({
  playerId: z.string().uuid("Player ID must be a valid UUID"),
  askingPrice: z.number().int().min(1, "Asking price must be at least 1"),
});

export type SellPlayerInput = z.infer<typeof sellPlayerSchema>;
