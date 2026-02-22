import { createPlayerSchema, updatePlayerSchema } from "../../schemas/player.schema";

describe("player.schema", () => {
  describe("createPlayerSchema", () => {
    it("should validate a correct player payload", () => {
      const data = {
        name: "Gabigol",
        position: "Forward",
        number: 9,
        nationality: "Brazilian",
        birthDate: "1996-08-30",
      };
      const result = createPlayerSchema.parse(data);
      expect(result).toEqual(data);
    });

    it("should accept optional teamId", () => {
      const data = {
        name: "Gabigol",
        position: "Forward",
        number: 9,
        nationality: "Brazilian",
        birthDate: "1996-08-30",
        teamId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      };
      const result = createPlayerSchema.parse(data);
      expect(result.teamId).toBe("a1b2c3d4-e5f6-7890-abcd-ef1234567890");
    });

    it("should reject invalid birthDate format", () => {
      const data = {
        name: "Gabigol",
        position: "Forward",
        number: 9,
        nationality: "Brazilian",
        birthDate: "30/08/1996",
      };
      expect(() => createPlayerSchema.parse(data)).toThrow();
    });

    it("should reject number out of range", () => {
      const data = {
        name: "Gabigol",
        position: "Forward",
        number: 100,
        nationality: "Brazilian",
        birthDate: "1996-08-30",
      };
      expect(() => createPlayerSchema.parse(data)).toThrow();
    });

    it("should reject empty name", () => {
      const data = {
        name: "",
        position: "Forward",
        number: 9,
        nationality: "Brazilian",
        birthDate: "1996-08-30",
      };
      expect(() => createPlayerSchema.parse(data)).toThrow();
    });
  });

  describe("updatePlayerSchema", () => {
    it("should accept partial data", () => {
      const data = { name: "Gabriel Barbosa" };
      const result = updatePlayerSchema.parse(data);
      expect(result).toEqual(data);
    });

    it("should accept empty object", () => {
      const result = updatePlayerSchema.parse({});
      expect(result).toEqual({});
    });
  });
});
