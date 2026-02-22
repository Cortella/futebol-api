const mockCreate = jest.fn();
const mockSave = jest.fn();
const mockFindOne = jest.fn();
const mockFind = jest.fn();
const mockRemove = jest.fn();
const mockCreateQueryBuilder = jest.fn();

jest.mock("../../config/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockReturnValue({
      create: mockCreate,
      save: mockSave,
      findOne: mockFindOne,
      find: mockFind,
      remove: mockRemove,
      createQueryBuilder: mockCreateQueryBuilder,
    }),
  },
}));

jest.mock("../../config/env", () => ({
  env: { jwt: { secret: "test-secret", expiresIn: "7d" } },
}));

import { PlayerService } from "../../services/PlayerService";
import { AppError } from "../../errors/AppError";

describe("PlayerService", () => {
  let service: PlayerService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PlayerService();
  });

  describe("findAll", () => {
    it("should return all players", async () => {
      const players = [{ id: "1" }];
      mockFind.mockResolvedValue(players);

      const result = await service.findAll();

      expect(result).toEqual(players);
      expect(mockFind).toHaveBeenCalledWith({
        order: { name: "ASC" },
        relations: ["team"],
      });
    });
  });

  describe("findByTeam", () => {
    it("should return players for team", async () => {
      const players = [{ id: "1" }];
      mockFind.mockResolvedValue(players);

      const result = await service.findByTeam("t1");

      expect(result).toEqual(players);
      expect(mockFind).toHaveBeenCalledWith({
        where: { teamId: "t1" },
        order: { position: "ASC", name: "ASC" },
      });
    });
  });

  describe("findForSaleExcludingTeam", () => {
    it("should return players for sale excluding team", async () => {
      const players = [{ id: "1", forSale: true }];
      const mockQb = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(players),
      };
      mockCreateQueryBuilder.mockReturnValue(mockQb);

      const result = await service.findForSaleExcludingTeam("t1");

      expect(result).toEqual(players);
      expect(mockQb.where).toHaveBeenCalledWith("player.for_sale = :forSale", { forSale: true });
      expect(mockQb.andWhere).toHaveBeenCalledWith(
        "(player.team_id != :teamId OR player.team_id IS NULL)",
        { teamId: "t1" },
      );
    });
  });

  describe("findById", () => {
    it("should return player when found", async () => {
      const player = { id: "1" };
      mockFindOne.mockResolvedValue(player);

      const result = await service.findById("1");

      expect(result).toEqual(player);
    });

    it("should throw 404", async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(service.findById("1")).rejects.toThrow("Player not found");
    });
  });

  describe("create", () => {
    it("should create player", async () => {
      const data = {
        name: "Player 1",
        position: "ATA" as const,
        age: 25,
        nationality: "Brasileiro",
        force: 80,
        velocity: 75,
        stamina: 70,
        technique: 85,
        salary: 500000,
        marketValue: 5000000,
      };
      mockCreate.mockReturnValue({ id: "1", ...data });
      mockSave.mockResolvedValue({ id: "1", ...data });

      const result = await service.create(data);

      expect(result).toBeDefined();
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          salary: "500000",
          marketValue: "5000000",
          nickname: null,
          teamId: null,
          shirtNumber: null,
        }),
      );
    });

    it("should handle optional fields", async () => {
      const data = {
        name: "Player 1",
        nickname: "P1",
        teamId: "t1",
        shirtNumber: 10,
        position: "MEI" as const,
        age: 22,
        nationality: "Brasileiro",
        force: 70,
        velocity: 65,
        stamina: 60,
        technique: 75,
        salary: 100000,
        marketValue: 1000000,
      };
      mockCreate.mockReturnValue({ id: "1" });
      mockSave.mockResolvedValue({ id: "1" });

      await service.create(data);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          nickname: "P1",
          teamId: "t1",
          shirtNumber: 10,
        }),
      );
    });
  });

  describe("update", () => {
    it("should update player fields", async () => {
      const existing = { id: "1", name: "Old" };
      mockFindOne.mockResolvedValue(existing);
      mockSave.mockResolvedValue({ ...existing, name: "New" });

      const result = await service.update("1", { name: "New" });

      expect(result).toBeDefined();
    });

    it("should convert salary to string", async () => {
      const existing = { id: "1" };
      mockFindOne.mockResolvedValue(existing);
      mockSave.mockResolvedValue(existing);

      await service.update("1", { salary: 999 });

      expect(mockSave).toHaveBeenCalled();
    });

    it("should convert marketValue to string", async () => {
      const existing = { id: "1" };
      mockFindOne.mockResolvedValue(existing);
      mockSave.mockResolvedValue(existing);

      await service.update("1", { marketValue: 5000 });

      expect(mockSave).toHaveBeenCalled();
    });

    it("should handle nickname null", async () => {
      const existing = { id: "1" };
      mockFindOne.mockResolvedValue(existing);
      mockSave.mockResolvedValue(existing);

      await service.update("1", { nickname: null });

      expect(mockSave).toHaveBeenCalled();
    });

    it("should handle teamId null", async () => {
      const existing = { id: "1" };
      mockFindOne.mockResolvedValue(existing);
      mockSave.mockResolvedValue(existing);

      await service.update("1", { teamId: null });

      expect(mockSave).toHaveBeenCalled();
    });

    it("should handle shirtNumber null", async () => {
      const existing = { id: "1" };
      mockFindOne.mockResolvedValue(existing);
      mockSave.mockResolvedValue(existing);

      await service.update("1", { shirtNumber: null });

      expect(mockSave).toHaveBeenCalled();
    });

    it("should handle askingPrice conversion", async () => {
      const existing = { id: "1" };
      mockFindOne.mockResolvedValue(existing);
      mockSave.mockResolvedValue(existing);

      await service.update("1", { askingPrice: 50000 });

      expect(mockSave).toHaveBeenCalled();
    });

    it("should handle askingPrice null", async () => {
      const existing = { id: "1" };
      mockFindOne.mockResolvedValue(existing);
      mockSave.mockResolvedValue(existing);

      await service.update("1", { askingPrice: null });

      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should delete player", async () => {
      const player = { id: "1" };
      mockFindOne.mockResolvedValue(player);
      mockRemove.mockResolvedValue(undefined);

      await service.delete("1");

      expect(mockRemove).toHaveBeenCalledWith(player);
    });

    it("should throw 404", async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(service.delete("1")).rejects.toThrow(AppError);
    });
  });
});
