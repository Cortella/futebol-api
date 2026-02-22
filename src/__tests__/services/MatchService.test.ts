const mockCreate = jest.fn();
const mockSave = jest.fn();
const mockFindOne = jest.fn();
const mockFind = jest.fn();
const mockRemove = jest.fn();

const mockRoundFindOne = jest.fn();

jest.mock("../../config/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockImplementation((entity: any) => {
      const name = typeof entity === "function" ? entity.name : entity;

      if (name === "Round") {
        return { findOne: mockRoundFindOne };
      }

      return {
        create: mockCreate,
        save: mockSave,
        findOne: mockFindOne,
        find: mockFind,
        remove: mockRemove,
      };
    }),
  },
}));

jest.mock("../../config/env", () => ({
  env: { jwt: { secret: "test-secret", expiresIn: "7d" } },
}));

import { MatchService } from "../../services/MatchService";
import { AppError } from "../../errors/AppError";

describe("MatchService", () => {
  let service: MatchService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MatchService();
  });

  describe("findAll", () => {
    it("should return all matches with relations", async () => {
      const matches = [{ id: "1" }];
      mockFind.mockResolvedValue(matches);

      const result = await service.findAll();

      expect(result).toEqual(matches);
      expect(mockFind).toHaveBeenCalledWith({
        relations: ["homeTeam", "awayTeam", "round"],
      });
    });
  });

  describe("findByRound", () => {
    it("should return matches for round", async () => {
      const matches = [{ id: "1" }];
      mockFind.mockResolvedValue(matches);

      const result = await service.findByRound("r1");

      expect(result).toEqual(matches);
      expect(mockFind).toHaveBeenCalledWith({
        where: { roundId: "r1" },
        relations: ["homeTeam", "awayTeam"],
      });
    });
  });

  describe("findById", () => {
    it("should return match when found", async () => {
      const match = { id: "1" };
      mockFindOne.mockResolvedValue(match);

      const result = await service.findById("1");

      expect(result).toEqual(match);
    });

    it("should throw 404", async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(service.findById("1")).rejects.toThrow("Match not found");
    });
  });

  describe("findNextForTeam", () => {
    it("should return next match for team", async () => {
      mockRoundFindOne.mockResolvedValue({ id: "r1" });
      const match = { id: "m1", homeTeamId: "t1" };
      mockFindOne.mockResolvedValue(match);

      const result = await service.findNextForTeam("d1", 5, "t1");

      expect(result).toEqual(match);
      expect(mockRoundFindOne).toHaveBeenCalledWith({
        where: { divisionId: "d1", number: 5 },
      });
    });

    it("should return null when round not found", async () => {
      mockRoundFindOne.mockResolvedValue(null);

      const result = await service.findNextForTeam("d1", 99, "t1");

      expect(result).toBeNull();
    });

    it("should return null when match not found", async () => {
      mockRoundFindOne.mockResolvedValue({ id: "r1" });
      mockFindOne.mockResolvedValue(null);

      const result = await service.findNextForTeam("d1", 5, "t1");

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create match", async () => {
      const data = {
        roundId: "r1",
        divisionId: "d1",
        homeTeamId: "t1",
        awayTeamId: "t2",
      };
      mockCreate.mockReturnValue(data);
      mockSave.mockResolvedValue({ id: "1", ...data });

      const result = await service.create(data);

      expect(result).toBeDefined();
    });
  });

  describe("delete", () => {
    it("should delete match", async () => {
      const match = { id: "1" };
      mockFindOne.mockResolvedValue(match);
      mockRemove.mockResolvedValue(undefined);

      await service.delete("1");

      expect(mockRemove).toHaveBeenCalledWith(match);
    });

    it("should throw 404", async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(service.delete("1")).rejects.toThrow(AppError);
    });
  });
});
