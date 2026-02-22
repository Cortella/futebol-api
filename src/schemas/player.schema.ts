import { z } from "zod";

const playerPositions = [
  "GOL",
  "ZAG",
  "LD",
  "LE",
  "VOL",
  "MC",
  "MEI",
  "PD",
  "PE",
  "ATA",
  "SA",
] as const;

export const createPlayerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  nickname: z.string().max(50).nullish(),
  teamId: z.string().uuid("Team ID must be a valid UUID").nullish(),
  position: z.enum(playerPositions, { message: "Invalid position" }),
  age: z.number().int().min(16, "Age must be at least 16").max(40, "Age max is 40"),
  nationality: z.string().min(1, "Nationality is required").max(100),
  shirtNumber: z.number().int().min(1).max(99).nullish(),
  force: z.number().int().min(1, "Force must be at least 1").max(100, "Force max is 100"),
  velocity: z.number().int().min(1, "Velocity must be at least 1").max(100, "Velocity max is 100"),
  stamina: z.number().int().min(1, "Stamina must be at least 1").max(100, "Stamina max is 100"),
  technique: z
    .number()
    .int()
    .min(1, "Technique must be at least 1")
    .max(100, "Technique max is 100"),
  salary: z.number().int().min(0, "Salary must be non-negative"),
  marketValue: z.number().int().min(0, "Market value must be non-negative"),
});

export const updatePlayerSchema = createPlayerSchema.partial();

export type CreatePlayerInput = z.infer<typeof createPlayerSchema>;
export type UpdatePlayerInput = z.infer<typeof updatePlayerSchema>;
