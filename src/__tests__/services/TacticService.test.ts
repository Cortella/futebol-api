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

import { TacticService } from "../../services/TacticService";
import { AppError } from "../../errors/AppError";

describe("TacticService", () => {
  let service: TacticService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TacticService();
  });

  describe("findByCareer", () => {
    it("should return tactic for career", async () => {
      const tactic = { id: "1", careerId: "c1" };
      mockFindOne.mockResolvedValue(tactic);

      const result = await service.findByCareer("c1");

      expect(result).toEqual(tactic);
    });

    it("should return null when not found", async () => {
      mockFindOne.mockResolvedValue(null);

      const result = await service.findByCareer("c1");

      expect(result).toBeNull();
    });
  });

  describe("findById", () => {
    it("should return tactic", async () => {
      const tactic = { id: "1" };
      mockFindOne.mockResolvedValue(tactic);

      const result = await service.findById("1");

      expect(result).toEqual(tactic);
    });

    it("should throw 404", async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(service.findById("1")).rejects.toThrow("Tactic not found");
    });
  });

  describe("create", () => {
    const validData = {
      careerId: "c1",
      formation: "4-4-2" as const,
      style: "moderate" as const,
      marking: "zone" as const,
      tempo: "normal" as const,
      passing: "mixed" as const,
      pressure: "normal" as const,
    };

    it("should create tactic", async () => {
      mockFindOne.mockResolvedValue(null);
      mockCreate.mockReturnValue(validData);
      mockSave.mockResolvedValue({ id: "1", ...validData });

      const result = await service.create(validData);

      expect(result).toBeDefined();
    });

    it("should throw 409 if tactic already exists for career", async () => {
      mockFindOne.mockResolvedValue({ id: "existing" });

      await expect(service.create(validData)).rejects.toThrow(
        "Tactic already exists for this career",
      );
    });
  });

  describe("update", () => {
    it("should update tactic", async () => {
      const existing = { id: "1", formation: "4-4-2" };
      mockFindOne.mockResolvedValue(existing);
      mockSave.mockResolvedValue({ ...existing, formation: "4-3-3" });

      const result = await service.update("1", { formation: "4-3-3" as const });

      expect(result).toBeDefined();
    });
  });

  describe("updateByCareer", () => {
    it("should create tactic when none exists", async () => {
      mockFindOne.mockResolvedValue(null);
      mockCreate.mockReturnValue({ careerId: "c1", formation: "4-3-3" });
      mockSave.mockResolvedValue({ id: "1", careerId: "c1", formation: "4-3-3" });

      const result = await service.updateByCareer("c1", { formation: "4-3-3" as const });

      expect(result).toBeDefined();
      expect(mockCreate).toHaveBeenCalledWith({ careerId: "c1", formation: "4-3-3" });
    });

    it("should update existing tactic", async () => {
      const existing = { id: "1", careerId: "c1", formation: "4-4-2" };
      mockFindOne.mockResolvedValue(existing);
      mockSave.mockResolvedValue({ ...existing, formation: "4-3-3" });

      const result = await service.updateByCareer("c1", { formation: "4-3-3" as const });

      expect(result).toBeDefined();
    });
  });

  describe("delete", () => {
    it("should delete tactic", async () => {
      const tactic = { id: "1" };
      mockFindOne.mockResolvedValue(tactic);
      mockRemove.mockResolvedValue(undefined);

      await service.delete("1");

      expect(mockRemove).toHaveBeenCalledWith(tactic);
    });

    it("should throw 404", async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(service.delete("1")).rejects.toThrow(AppError);
    });
  });
});
