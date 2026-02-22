const mockCreate = jest.fn();
const mockSave = jest.fn();
const mockFindOne = jest.fn();
const mockFind = jest.fn();
const mockRemove = jest.fn();

jest.mock("../../config/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockReturnValue({
      create: mockCreate,
      save: mockSave,
      findOne: mockFindOne,
      find: mockFind,
      remove: mockRemove,
    }),
  },
}));

jest.mock("../../config/env", () => ({
  env: { jwt: { secret: "test-secret", expiresIn: "7d" } },
}));

import { DivisionService } from "../../services/DivisionService";
import { AppError } from "../../errors/AppError";

describe("DivisionService", () => {
  let service: DivisionService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new DivisionService();
  });

  describe("findAll", () => {
    it("should return all divisions", async () => {
      const divisions = [{ id: "1" }];
      mockFind.mockResolvedValue(divisions);

      const result = await service.findAll();

      expect(result).toEqual(divisions);
      expect(mockFind).toHaveBeenCalledWith({
        order: { level: "ASC", name: "ASC" },
        relations: ["championship", "season"],
      });
    });
  });

  describe("findById", () => {
    it("should return division when found", async () => {
      const division = { id: "1", name: "Série A" };
      mockFindOne.mockResolvedValue(division);

      const result = await service.findById("1");

      expect(result).toEqual(division);
    });

    it("should throw 404", async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(service.findById("1")).rejects.toThrow("Division not found");
    });
  });

  describe("findByChampionship", () => {
    it("should return divisions for championship", async () => {
      const divisions = [{ id: "1" }];
      mockFind.mockResolvedValue(divisions);

      const result = await service.findByChampionship("ch1");

      expect(result).toEqual(divisions);
      expect(mockFind).toHaveBeenCalledWith({
        where: { championshipId: "ch1" },
        order: { level: "ASC" },
        relations: ["season"],
      });
    });
  });

  describe("create", () => {
    it("should create division with calculated totalRounds", async () => {
      const input = {
        championshipId: "ch1",
        seasonId: "s1",
        name: "Série A",
        level: 1,
        totalTeams: 20,
        promotionSlots: 0,
        relegationSlots: 4,
      };
      const created = { id: "1", ...input, totalRounds: 38, status: "not_started" };
      mockCreate.mockReturnValue(created);
      mockSave.mockResolvedValue(created);

      const result = await service.create(input);

      expect(result).toEqual(created);
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ totalRounds: 38, status: "not_started" }),
      );
    });
  });

  describe("update", () => {
    it("should update and recalculate totalRounds", async () => {
      const existing = { id: "1", totalTeams: 20, totalRounds: 38 };
      mockFindOne.mockResolvedValue(existing);
      mockSave.mockResolvedValue({ ...existing, totalTeams: 10, totalRounds: 18 });

      const result = await service.update("1", { totalTeams: 10 });

      expect(mockSave).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it("should use existing totalTeams if not provided", async () => {
      const existing = { id: "1", totalTeams: 20, totalRounds: 38, name: "Série A" };
      mockFindOne.mockResolvedValue(existing);
      mockSave.mockResolvedValue(existing);

      await service.update("1", { name: "Série B" });

      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should delete division", async () => {
      const division = { id: "1" };
      mockFindOne.mockResolvedValue(division);
      mockRemove.mockResolvedValue(undefined);

      await service.delete("1");

      expect(mockRemove).toHaveBeenCalledWith(division);
    });

    it("should throw 404", async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(service.delete("1")).rejects.toThrow(AppError);
    });
  });
});
