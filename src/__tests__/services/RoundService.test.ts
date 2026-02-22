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

import { RoundService } from "../../services/RoundService";
import { AppError } from "../../errors/AppError";

describe("RoundService", () => {
  let service: RoundService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new RoundService();
  });

  describe("findAll", () => {
    it("should return all rounds", async () => {
      const rounds = [{ id: "1" }];
      mockFind.mockResolvedValue(rounds);

      const result = await service.findAll();

      expect(result).toEqual(rounds);
      expect(mockFind).toHaveBeenCalledWith({ order: { number: "ASC" } });
    });
  });

  describe("findByDivision", () => {
    it("should return rounds for division", async () => {
      const rounds = [{ id: "1" }];
      mockFind.mockResolvedValue(rounds);

      const result = await service.findByDivision("d1");

      expect(result).toEqual(rounds);
    });
  });

  describe("findById", () => {
    it("should return round", async () => {
      const round = { id: "1" };
      mockFindOne.mockResolvedValue(round);

      const result = await service.findById("1");

      expect(result).toEqual(round);
    });

    it("should throw 404", async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(service.findById("1")).rejects.toThrow("Round not found");
    });
  });

  describe("findByDivisionAndNumber", () => {
    it("should return round for division and number", async () => {
      const round = { id: "1", divisionId: "d1", number: 5 };
      mockFindOne.mockResolvedValue(round);

      const result = await service.findByDivisionAndNumber("d1", 5);

      expect(result).toEqual(round);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { divisionId: "d1", number: 5 },
      });
    });

    it("should throw 404 when not found", async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(service.findByDivisionAndNumber("d1", 99)).rejects.toThrow("Round not found");
    });
  });

  describe("create", () => {
    it("should create round", async () => {
      const data = { divisionId: "d1", seasonId: "s1", number: 1 };
      mockCreate.mockReturnValue(data);
      mockSave.mockResolvedValue({ id: "1", ...data });

      const result = await service.create(data);

      expect(result).toBeDefined();
    });
  });

  describe("delete", () => {
    it("should delete round", async () => {
      const round = { id: "1" };
      mockFindOne.mockResolvedValue(round);
      mockRemove.mockResolvedValue(undefined);

      await service.delete("1");

      expect(mockRemove).toHaveBeenCalledWith(round);
    });

    it("should throw 404", async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(service.delete("1")).rejects.toThrow(AppError);
    });
  });
});
