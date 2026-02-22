import { createTeamSchema, updateTeamSchema } from "../../schemas/team.schema";

const validTeam = {
  name: "Palmeiras",
  shortName: "PAL",
  city: "São Paulo",
  state: "SP",
  stadium: "Allianz Parque",
  stadiumCapacity: 43713,
  colors: "Verde e Branco",
  prestige: 92,
  baseWage: 1500000000,
};

describe("createTeamSchema", () => {
  it("should validate a correct team input", () => {
    const result = createTeamSchema.parse(validTeam);

    expect(result.name).toBe("Palmeiras");
    expect(result.shortName).toBe("PAL");
    expect(result.stadiumCapacity).toBe(43713);
    expect(result.prestige).toBe(92);
    expect(result.baseWage).toBe(1500000000);
  });

  it("should accept optional logo as null", () => {
    const result = createTeamSchema.parse({ ...validTeam, logo: null });

    expect(result.logo).toBeNull();
  });

  it("should accept valid logo URL", () => {
    const result = createTeamSchema.parse({ ...validTeam, logo: "https://example.com/logo.png" });

    expect(result.logo).toBe("https://example.com/logo.png");
  });

  it("should reject invalid logo URL", () => {
    expect(() => createTeamSchema.parse({ ...validTeam, logo: "not-a-url" })).toThrow();
  });

  it("should reject empty name", () => {
    expect(() => createTeamSchema.parse({ ...validTeam, name: "" })).toThrow();
  });

  it("should reject shortName with wrong length", () => {
    expect(() => createTeamSchema.parse({ ...validTeam, shortName: "PA" })).toThrow();
    expect(() => createTeamSchema.parse({ ...validTeam, shortName: "PALM" })).toThrow();
  });

  it("should reject lowercase shortName", () => {
    expect(() => createTeamSchema.parse({ ...validTeam, shortName: "pal" })).toThrow();
  });

  it("should reject state with wrong length", () => {
    expect(() => createTeamSchema.parse({ ...validTeam, state: "S" })).toThrow();
    expect(() => createTeamSchema.parse({ ...validTeam, state: "SPP" })).toThrow();
  });

  it("should reject lowercase state", () => {
    expect(() => createTeamSchema.parse({ ...validTeam, state: "sp" })).toThrow();
  });

  it("should reject stadiumCapacity < 1", () => {
    expect(() => createTeamSchema.parse({ ...validTeam, stadiumCapacity: 0 })).toThrow();
  });

  it("should reject prestige < 1 or > 100", () => {
    expect(() => createTeamSchema.parse({ ...validTeam, prestige: 0 })).toThrow();
    expect(() => createTeamSchema.parse({ ...validTeam, prestige: 101 })).toThrow();
  });

  it("should reject negative baseWage", () => {
    expect(() => createTeamSchema.parse({ ...validTeam, baseWage: -1 })).toThrow();
  });

  it("should reject missing required fields", () => {
    expect(() => createTeamSchema.parse({})).toThrow();
    expect(() => createTeamSchema.parse({ name: "Test" })).toThrow();
  });
});

describe("updateTeamSchema", () => {
  it("should accept partial data", () => {
    const result = updateTeamSchema.parse({ name: "Corinthians" });

    expect(result.name).toBe("Corinthians");
    expect(result.shortName).toBeUndefined();
  });

  it("should accept empty object", () => {
    const result = updateTeamSchema.parse({});

    expect(result).toEqual({});
  });

  it("should still validate field rules when provided", () => {
    expect(() => updateTeamSchema.parse({ shortName: "pa" })).toThrow();
    expect(() => updateTeamSchema.parse({ prestige: 101 })).toThrow();
  });
});
