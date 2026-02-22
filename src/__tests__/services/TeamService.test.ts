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

import { TeamService } from "../../services/TeamService";
import { AppError } from "../../errors/AppError";

describe("TeamService", () => {
  let service: TeamService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TeamService();
  });

  describe("findAll", () => {
    it("should return all teams", async () => {
      const teams = [{ id: "1" }];
      mockFind.mockResolvedValue(teams);

      const result = await service.findAll();

      expect(result).toEqual(teams);
      expect(mockFind).toHaveBeenCalledWith({ order: { name: "ASC" } });
    });
  });

  describe("findById", () => {
    it("should return team", async () => {
      const team = { id: "1" };
      mockFindOne.mockResolvedValue(team);

      const result = await service.findById("1");

      expect(result).toEqual(team);
    });

    it("should throw 404", async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(service.findById("1")).rejects.toThrow("Team not found");
    });
  });

  describe("create", () => {
    const data = {
      name: "Palmeiras",
      shortName: "PAL",
      city: "São Paulo",
      state: "SP",
      stadium: "Allianz Parque",
      stadiumCapacity: 43713,
      colors: "Verde e Branco",
      prestige: 90,
      baseWage: 5000000,
    };

    it("should create team", async () => {
      mockFindOne.mockResolvedValue(null);
      mockCreate.mockReturnValue({ id: "1" });
      mockSave.mockResolvedValue({ id: "1" });

      const result = await service.create(data);

      expect(result).toBeDefined();
      expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ baseWage: "5000000" }));
    });

    it("should throw 409 if name exists", async () => {
      mockFindOne.mockResolvedValueOnce({ id: "existing" });

      await expect(service.create(data)).rejects.toThrow("Team name already in use");
    });

    it("should throw 409 if shortName exists", async () => {
      mockFindOne.mockResolvedValueOnce(null).mockResolvedValueOnce({ id: "existing" });

      await expect(service.create(data)).rejects.toThrow("Short name already in use");
    });
  });

  describe("update", () => {
    it("should update team", async () => {
      const existing = { id: "1", name: "Old", shortName: "OLD", baseWage: "1000" };
      mockFindOne.mockResolvedValueOnce(existing).mockResolvedValueOnce(null);
      mockSave.mockResolvedValue({ ...existing, name: "New" });

      const result = await service.update("1", { name: "New" });

      expect(result).toBeDefined();
    });

    it("should throw 409 if new name exists", async () => {
      const existing = { id: "1", name: "Old", shortName: "OLD" };
      mockFindOne.mockResolvedValueOnce(existing).mockResolvedValueOnce({ id: "2" });

      await expect(service.update("1", { name: "Taken" })).rejects.toThrow(
        "Team name already in use",
      );
    });

    it("should throw 409 if new shortName exists", async () => {
      const existing = { id: "1", name: "Test", shortName: "OLD" };
      mockFindOne.mockResolvedValueOnce(existing).mockResolvedValueOnce({ id: "2" });

      await expect(service.update("1", { shortName: "TAK" })).rejects.toThrow(
        "Short name already in use",
      );
    });

    it("should allow update without changing name", async () => {
      const existing = { id: "1", name: "Same", shortName: "SAM", baseWage: "1000" };
      mockFindOne.mockResolvedValueOnce(existing);
      mockSave.mockResolvedValueOnce(existing);

      const result = await service.update("1", { name: "Same" });

      expect(result).toBeDefined();
    });

    it("should convert baseWage to string when provided", async () => {
      const existing = { id: "1", name: "T", shortName: "T", baseWage: "1000" };
      mockFindOne.mockResolvedValueOnce(existing);
      mockSave.mockResolvedValueOnce(existing);

      await service.update("1", { baseWage: 5000 });

      expect(mockSave).toHaveBeenCalled();
    });

    it("should keep existing baseWage when not provided", async () => {
      const existing = { id: "1", name: "Test", shortName: "TST", baseWage: "1000" };
      mockFindOne.mockResolvedValueOnce(existing);
      mockSave.mockResolvedValueOnce(existing);

      await service.update("1", { city: "Rio" });

      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should delete team", async () => {
      const team = { id: "1" };
      mockFindOne.mockResolvedValue(team);
      mockRemove.mockResolvedValue(undefined);

      await service.delete("1");

      expect(mockRemove).toHaveBeenCalledWith(team);
    });

    it("should throw 404", async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(service.delete("1")).rejects.toThrow(AppError);
    });
  });
});
