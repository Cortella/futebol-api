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

import { ChampionshipService } from "../../services/ChampionshipService";
import { AppError } from "../../errors/AppError";

describe("ChampionshipService", () => {
  let service: ChampionshipService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ChampionshipService();
  });

  describe("findAll", () => {
    it("should return all championships ordered by name", async () => {
      const championships = [{ id: "1", name: "A" }];
      mockFind.mockResolvedValue(championships);

      const result = await service.findAll();

      expect(result).toEqual(championships);
      expect(mockFind).toHaveBeenCalledWith({ order: { name: "ASC" } });
    });
  });

  describe("findById", () => {
    it("should return championship when found", async () => {
      const champ = { id: "1", name: "Brasileirão" };
      mockFindOne.mockResolvedValue(champ);

      const result = await service.findById("1");

      expect(result).toEqual(champ);
    });

    it("should throw 404 when not found", async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(service.findById("1")).rejects.toThrow("Championship not found");
    });
  });

  describe("create", () => {
    it("should create championship", async () => {
      mockFindOne.mockResolvedValue(null);
      const created = { id: "1", name: "Brasileirão", country: "Brasil", logo: null };
      mockCreate.mockReturnValue(created);
      mockSave.mockResolvedValue(created);

      const result = await service.create({ name: "Brasileirão", country: "Brasil" });

      expect(result).toEqual(created);
    });

    it("should handle logo field", async () => {
      mockFindOne.mockResolvedValue(null);
      mockCreate.mockReturnValue({});
      mockSave.mockResolvedValue({});

      await service.create({ name: "Test", country: "BR", logo: "http://logo.png" });

      expect(mockCreate).toHaveBeenCalledWith({
        name: "Test",
        country: "BR",
        logo: "http://logo.png",
      });
    });

    it("should set logo to null when undefined", async () => {
      mockFindOne.mockResolvedValue(null);
      mockCreate.mockReturnValue({});
      mockSave.mockResolvedValue({});

      await service.create({ name: "Test", country: "BR" });

      expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ logo: null }));
    });

    it("should throw 409 if name already exists", async () => {
      mockFindOne.mockResolvedValue({ id: "existing" });

      await expect(service.create({ name: "Brasileirão", country: "Brasil" })).rejects.toThrow(
        "Championship name already in use",
      );
    });
  });

  describe("update", () => {
    it("should update championship", async () => {
      const existing = { id: "1", name: "Old", country: "BR", logo: null };
      mockFindOne.mockResolvedValueOnce(existing).mockResolvedValueOnce(null);
      const updated = { ...existing, name: "New" };
      mockSave.mockResolvedValue(updated);

      const result = await service.update("1", { name: "New" });

      expect(result).toEqual(updated);
    });

    it("should throw 409 if new name already exists", async () => {
      const existing = { id: "1", name: "Old", country: "BR", logo: null };
      mockFindOne.mockResolvedValueOnce(existing).mockResolvedValueOnce({ id: "2", name: "New" });

      await expect(service.update("1", { name: "New" })).rejects.toThrow(
        "Championship name already in use",
      );
    });

    it("should allow update without changing name", async () => {
      const existing = { id: "1", name: "Same", country: "BR", logo: null };
      mockFindOne.mockResolvedValue(existing);
      mockSave.mockResolvedValue(existing);

      const result = await service.update("1", { name: "Same" });

      expect(result).toEqual(existing);
    });

    it("should handle logo update to null", async () => {
      const existing = { id: "1", name: "Test", country: "BR", logo: "http://old.png" };
      mockFindOne.mockResolvedValue(existing);
      mockSave.mockResolvedValue({ ...existing, logo: null });

      await service.update("1", { logo: null });

      expect(mockSave).toHaveBeenCalled();
    });

    it("should keep existing logo when not provided", async () => {
      const existing = { id: "1", name: "Test", country: "BR", logo: "http://old.png" };
      mockFindOne.mockResolvedValue(existing);
      mockSave.mockResolvedValue(existing);

      await service.update("1", { country: "Argentina" });

      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should delete championship", async () => {
      const champ = { id: "1" };
      mockFindOne.mockResolvedValue(champ);
      mockRemove.mockResolvedValue(undefined);

      await service.delete("1");

      expect(mockRemove).toHaveBeenCalledWith(champ);
    });

    it("should throw 404 if not found", async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(service.delete("1")).rejects.toThrow(AppError);
    });
  });
});
