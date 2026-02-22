const mockCareerCreate = jest.fn();
const mockCareerSave = jest.fn();
const mockCareerFindOne = jest.fn();
const mockCareerFind = jest.fn();
const mockCareerRemove = jest.fn();

const mockTeamFindOne = jest.fn();
const mockDivisionFindOne = jest.fn();
const mockSeasonFindOne = jest.fn();

jest.mock("../../config/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockImplementation((entity: any) => {
      const name = typeof entity === "function" ? entity.name : entity;

      if (name === "Career") {
        return {
          create: mockCareerCreate,
          save: mockCareerSave,
          findOne: mockCareerFindOne,
          find: mockCareerFind,
          remove: mockCareerRemove,
        };
      }

      if (name === "Team") return { findOne: mockTeamFindOne };
      if (name === "Division") return { findOne: mockDivisionFindOne };
      if (name === "Season") return { findOne: mockSeasonFindOne };

      return {};
    }),
  },
}));

jest.mock("../../config/env", () => ({
  env: { jwt: { secret: "test-secret", expiresIn: "7d" } },
}));

import { CareerService } from "../../services/CareerService";
import { AppError } from "../../errors/AppError";

describe("CareerService", () => {
  let service: CareerService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CareerService();
  });

  describe("findAllByUser", () => {
    it("should return careers for user", async () => {
      const careers = [{ id: "c1", userId: "u1" }];
      mockCareerFind.mockResolvedValue(careers);

      const result = await service.findAllByUser("u1");

      expect(result).toEqual(careers);
      expect(mockCareerFind).toHaveBeenCalledWith({
        where: { userId: "u1" },
        relations: ["team", "season", "division"],
        order: { createdAt: "DESC" },
      });
    });
  });

  describe("findById", () => {
    it("should return career when found and owned by user", async () => {
      const career = { id: "c1", userId: "u1" };
      mockCareerFindOne.mockResolvedValue(career);

      const result = await service.findById("c1", "u1");

      expect(result).toEqual(career);
    });

    it("should throw 404 when career not found", async () => {
      mockCareerFindOne.mockResolvedValue(null);

      await expect(service.findById("c1", "u1")).rejects.toThrow("Career not found");
    });

    it("should throw 403 when career belongs to another user", async () => {
      mockCareerFindOne.mockResolvedValue({ id: "c1", userId: "other-user" });

      await expect(service.findById("c1", "u1")).rejects.toThrow(
        "You can only manage your own career",
      );
    });
  });

  describe("create", () => {
    const input = { teamId: "t1", championshipId: "ch1" };

    it("should create career successfully", async () => {
      mockTeamFindOne.mockResolvedValue({ id: "t1", prestige: 80 });
      mockDivisionFindOne.mockResolvedValue({ id: "d1", seasonId: "s1" });
      mockSeasonFindOne.mockResolvedValue({ id: "s1" });
      const created = { id: "c1", userId: "u1", teamId: "t1" };
      mockCareerCreate.mockReturnValue(created);
      mockCareerSave.mockResolvedValue(created);

      const result = await service.create("u1", input);

      expect(result).toEqual(created);
      expect(mockCareerCreate).toHaveBeenCalledWith({
        userId: "u1",
        teamId: "t1",
        seasonId: "s1",
        divisionId: "d1",
        currentRound: 1,
        budget: String(80 * 100000000),
        reputation: 80,
        status: "active",
      });
    });

    it("should throw 404 if team not found", async () => {
      mockTeamFindOne.mockResolvedValue(null);

      await expect(service.create("u1", input)).rejects.toThrow("Team not found");
    });

    it("should throw 404 if no division found", async () => {
      mockTeamFindOne.mockResolvedValue({ id: "t1", prestige: 80 });
      mockDivisionFindOne.mockResolvedValue(null);

      await expect(service.create("u1", input)).rejects.toThrow(
        "No division found for this championship",
      );
    });

    it("should throw 404 if season not found", async () => {
      mockTeamFindOne.mockResolvedValue({ id: "t1", prestige: 80 });
      mockDivisionFindOne.mockResolvedValue({ id: "d1", seasonId: "s1" });
      mockSeasonFindOne.mockResolvedValue(null);

      await expect(service.create("u1", input)).rejects.toThrow("Season not found");
    });

    it("should cap reputation at 100", async () => {
      mockTeamFindOne.mockResolvedValue({ id: "t1", prestige: 150 });
      mockDivisionFindOne.mockResolvedValue({ id: "d1", seasonId: "s1" });
      mockSeasonFindOne.mockResolvedValue({ id: "s1" });
      mockCareerCreate.mockReturnValue({});
      mockCareerSave.mockResolvedValue({});

      await service.create("u1", input);

      expect(mockCareerCreate).toHaveBeenCalledWith(expect.objectContaining({ reputation: 100 }));
    });
  });

  describe("delete", () => {
    it("should delete career owned by user", async () => {
      const career = { id: "c1", userId: "u1" };
      mockCareerFindOne.mockResolvedValue(career);
      mockCareerRemove.mockResolvedValue(undefined);

      await service.delete("c1", "u1");

      expect(mockCareerRemove).toHaveBeenCalledWith(career);
    });

    it("should throw if career not found", async () => {
      mockCareerFindOne.mockResolvedValue(null);

      await expect(service.delete("c1", "u1")).rejects.toThrow(AppError);
    });
  });
});
