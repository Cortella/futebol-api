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

import { TransferService } from "../../services/TransferService";
import { AppError } from "../../errors/AppError";

describe("TransferService", () => {
  let service: TransferService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TransferService();
  });

  describe("findAll", () => {
    it("should return all transfers", async () => {
      const transfers = [{ id: "1" }];
      mockFind.mockResolvedValue(transfers);

      const result = await service.findAll();

      expect(result).toEqual(transfers);
      expect(mockFind).toHaveBeenCalledWith({
        relations: ["player", "fromTeam", "toTeam", "season"],
        order: { date: "DESC" },
      });
    });
  });

  describe("findBySeason", () => {
    it("should return transfers for season", async () => {
      const transfers = [{ id: "1" }];
      mockFind.mockResolvedValue(transfers);

      const result = await service.findBySeason("s1");

      expect(result).toEqual(transfers);
      expect(mockFind).toHaveBeenCalledWith({
        where: { seasonId: "s1" },
        relations: ["player", "fromTeam", "toTeam"],
        order: { date: "DESC" },
      });
    });
  });

  describe("findBySeasonAndTeam", () => {
    it("should return transfers for season and team", async () => {
      const transfers = [{ id: "1" }];
      mockFind.mockResolvedValue(transfers);

      const result = await service.findBySeasonAndTeam("s1", "t1");

      expect(result).toEqual(transfers);
      expect(mockFind).toHaveBeenCalledWith({
        where: [
          { seasonId: "s1", fromTeamId: "t1" },
          { seasonId: "s1", toTeamId: "t1" },
        ],
        relations: ["player", "fromTeam", "toTeam"],
        order: { date: "DESC" },
      });
    });
  });

  describe("findById", () => {
    it("should return transfer", async () => {
      const transfer = { id: "1" };
      mockFindOne.mockResolvedValue(transfer);

      const result = await service.findById("1");

      expect(result).toEqual(transfer);
    });

    it("should throw 404", async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(service.findById("1")).rejects.toThrow("Transfer not found");
    });
  });

  describe("create", () => {
    it("should create transfer with from team", async () => {
      const data = {
        playerId: "p1",
        fromTeamId: "t1",
        toTeamId: "t2",
        seasonId: "s1",
        price: 5000000,
        type: "buy" as const,
      };
      mockCreate.mockReturnValue(data);
      mockSave.mockResolvedValue({ id: "1", ...data });

      const result = await service.create(data);

      expect(result).toBeDefined();
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ price: "5000000", fromTeamId: "t1" }),
      );
    });

    it("should handle null fromTeamId", async () => {
      const data = {
        playerId: "p1",
        toTeamId: "t2",
        seasonId: "s1",
        price: 0,
        type: "free" as const,
      };
      mockCreate.mockReturnValue(data);
      mockSave.mockResolvedValue({ id: "1", ...data });

      await service.create(data);

      expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ fromTeamId: null }));
    });
  });

  describe("delete", () => {
    it("should delete transfer", async () => {
      const transfer = { id: "1" };
      mockFindOne.mockResolvedValue(transfer);
      mockRemove.mockResolvedValue(undefined);

      await service.delete("1");

      expect(mockRemove).toHaveBeenCalledWith(transfer);
    });

    it("should throw 404", async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(service.delete("1")).rejects.toThrow(AppError);
    });
  });
});
