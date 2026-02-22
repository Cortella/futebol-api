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

import { SeasonService } from "../../services/SeasonService";
import { AppError } from "../../errors/AppError";

describe("SeasonService", () => {
  let service: SeasonService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SeasonService();
  });

  describe("findAll", () => {
    it("should return all seasons", async () => {
      const seasons = [{ id: "1", year: 2026 }];
      mockFind.mockResolvedValue(seasons);

      const result = await service.findAll();

      expect(result).toEqual(seasons);
      expect(mockFind).toHaveBeenCalledWith({ order: { year: "DESC" } });
    });
  });

  describe("findById", () => {
    it("should return season", async () => {
      const season = { id: "1", year: 2026 };
      mockFindOne.mockResolvedValue(season);

      const result = await service.findById("1");

      expect(result).toEqual(season);
    });

    it("should throw 404", async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(service.findById("1")).rejects.toThrow("Season not found");
    });
  });

  describe("create", () => {
    it("should create season", async () => {
      mockFindOne.mockResolvedValue(null);
      const created = { id: "1", year: 2026 };
      mockCreate.mockReturnValue(created);
      mockSave.mockResolvedValue(created);

      const result = await service.create({ year: 2026 });

      expect(result).toEqual(created);
    });

    it("should throw 409 if year exists", async () => {
      mockFindOne.mockResolvedValue({ id: "existing" });

      await expect(service.create({ year: 2026 })).rejects.toThrow("Season year already exists");
    });
  });

  describe("update", () => {
    it("should update season", async () => {
      const existing = { id: "1", year: 2026 };
      mockFindOne.mockResolvedValueOnce(existing).mockResolvedValueOnce(null);
      mockSave.mockResolvedValue({ ...existing, year: 2027 });

      const result = await service.update("1", { year: 2027 });

      expect(result).toBeDefined();
    });

    it("should throw 409 if new year exists", async () => {
      const existing = { id: "1", year: 2026 };
      mockFindOne.mockResolvedValueOnce(existing).mockResolvedValueOnce({ id: "2" });

      await expect(service.update("1", { year: 2027 })).rejects.toThrow(
        "Season year already exists",
      );
    });

    it("should allow update without changing year", async () => {
      const existing = { id: "1", year: 2026 };
      mockFindOne.mockResolvedValue(existing);
      mockSave.mockResolvedValue(existing);

      const result = await service.update("1", { year: 2026 });

      expect(result).toBeDefined();
    });
  });

  describe("delete", () => {
    it("should delete season", async () => {
      const season = { id: "1" };
      mockFindOne.mockResolvedValue(season);
      mockRemove.mockResolvedValue(undefined);

      await service.delete("1");

      expect(mockRemove).toHaveBeenCalledWith(season);
    });

    it("should throw 404", async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(service.delete("1")).rejects.toThrow(AppError);
    });
  });
});
