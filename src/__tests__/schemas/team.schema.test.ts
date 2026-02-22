import { createTeamSchema, updateTeamSchema } from "../../schemas/team.schema";

describe("team.schema", () => {
  describe("createTeamSchema", () => {
    it("should validate a correct team payload", () => {
      const data = {
        name: "Flamengo",
        city: "Rio de Janeiro",
        stadium: "Maracanã",
        foundedYear: 1895,
      };
      const result = createTeamSchema.parse(data);
      expect(result).toEqual(data);
    });

    it("should accept optional logoUrl", () => {
      const data = {
        name: "Flamengo",
        city: "Rio de Janeiro",
        stadium: "Maracanã",
        foundedYear: 1895,
        logoUrl: "https://example.com/logo.png",
      };
      const result = createTeamSchema.parse(data);
      expect(result.logoUrl).toBe("https://example.com/logo.png");
    });

    it("should reject empty name", () => {
      const data = {
        name: "",
        city: "Rio",
        stadium: "Maracanã",
        foundedYear: 1895,
      };
      expect(() => createTeamSchema.parse(data)).toThrow();
    });

    it("should reject invalid foundedYear", () => {
      const data = {
        name: "Flamengo",
        city: "Rio",
        stadium: "Maracanã",
        foundedYear: 1700,
      };
      expect(() => createTeamSchema.parse(data)).toThrow();
    });
  });

  describe("updateTeamSchema", () => {
    it("should accept partial data", () => {
      const data = { name: "Flamengo RJ" };
      const result = updateTeamSchema.parse(data);
      expect(result).toEqual(data);
    });

    it("should accept empty object", () => {
      const result = updateTeamSchema.parse({});
      expect(result).toEqual({});
    });
  });
});
