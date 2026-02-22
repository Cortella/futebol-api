const mockFind = jest.fn();
const mockFindOne = jest.fn();
const mockCreate = jest.fn();
const mockSave = jest.fn();
const mockRemove = jest.fn();

jest.mock("../../config/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockReturnValue({
      find: mockFind,
      findOne: mockFindOne,
      create: mockCreate,
      save: mockSave,
      remove: mockRemove,
    }),
  },
}));

import { PlayerService } from "../../services/PlayerService";
import { AppError } from "../../errors/AppError";

describe("PlayerService", () => {
  let service: PlayerService;

  beforeEach(() => {
    service = new PlayerService();
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("should return all players with team", async () => {
      const players = [{ id: "1", name: "Gabigol" }];
      mockFind.mockResolvedValue(players);

      const result = await service.findAll();

      expect(result).toEqual(players);
      expect(mockFind).toHaveBeenCalledWith({ relations: ["team"] });
    });
  });

  describe("findById", () => {
    it("should return a player when found", async () => {
      const player = { id: "1", name: "Gabigol" };
      mockFindOne.mockResolvedValue(player);

      const result = await service.findById("1");

      expect(result).toEqual(player);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: "1" },
        relations: ["team"],
      });
    });

    it("should throw AppError when player not found", async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(service.findById("999")).rejects.toThrow(AppError);
      await expect(service.findById("999")).rejects.toThrow("Player not found");
    });
  });

  describe("findByTeam", () => {
    it("should return players by team id", async () => {
      const players = [{ id: "1", name: "Gabigol", teamId: "t1" }];
      mockFind.mockResolvedValue(players);

      const result = await service.findByTeam("t1");

      expect(result).toEqual(players);
      expect(mockFind).toHaveBeenCalledWith({
        where: { teamId: "t1" },
        relations: ["team"],
      });
    });
  });

  describe("create", () => {
    it("should create and save a player", async () => {
      const data = {
        name: "Gabigol",
        position: "Forward",
        number: 9,
        nationality: "Brazilian",
        birthDate: "1996-08-30",
      };
      const created = { ...data, id: "1" };
      mockCreate.mockReturnValue(created);
      mockSave.mockResolvedValue(created);

      const result = await service.create(data);

      expect(result).toEqual(created);
      expect(mockCreate).toHaveBeenCalledWith(data);
      expect(mockSave).toHaveBeenCalledWith(created);
    });
  });

  describe("update", () => {
    it("should update and save a player", async () => {
      const existing = {
        id: "1",
        name: "Gabigol",
        position: "Forward",
        number: 9,
        nationality: "Brazilian",
        birthDate: "1996-08-30",
      };
      const updateData = { name: "Gabriel Barbosa" };
      const updated = { ...existing, ...updateData };

      mockFindOne.mockResolvedValue(existing);
      mockSave.mockResolvedValue(updated);

      const result = await service.update("1", updateData);

      expect(result).toEqual(updated);
      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should find and remove a player", async () => {
      const player = { id: "1", name: "Gabigol" };
      mockFindOne.mockResolvedValue(player);
      mockRemove.mockResolvedValue(player);

      await service.delete("1");

      expect(mockRemove).toHaveBeenCalledWith(player);
    });
  });
});
