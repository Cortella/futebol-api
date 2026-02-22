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

import { LineupPlayerService } from "../../services/LineupPlayerService";
import { AppError } from "../../errors/AppError";

describe("LineupPlayerService", () => {
  let service: LineupPlayerService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new LineupPlayerService();
  });

  describe("findByLineup", () => {
    it("should return players for lineup", async () => {
      const players = [{ id: "1" }];
      mockFind.mockResolvedValue(players);

      const result = await service.findByLineup("l1");

      expect(result).toEqual(players);
      expect(mockFind).toHaveBeenCalledWith({
        where: { lineupId: "l1" },
        relations: ["player"],
        order: { positionSlot: "ASC" },
      });
    });
  });

  describe("findById", () => {
    it("should return lineup player", async () => {
      const lp = { id: "1" };
      mockFindOne.mockResolvedValue(lp);

      const result = await service.findById("1");

      expect(result).toEqual(lp);
    });

    it("should throw 404", async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(service.findById("1")).rejects.toThrow("LineupPlayer not found");
    });
  });

  describe("create", () => {
    it("should create lineup player", async () => {
      const data = {
        lineupId: "l1",
        playerId: "p1",
        positionSlot: "GOL1",
        isStarter: true,
      };
      mockCreate.mockReturnValue(data);
      mockSave.mockResolvedValue({ id: "1", ...data });

      const result = await service.create(data);

      expect(result).toBeDefined();
    });
  });

  describe("update", () => {
    it("should update lineup player", async () => {
      const existing = { id: "1", positionSlot: "GOL1" };
      mockFindOne.mockResolvedValue(existing);
      mockSave.mockResolvedValue({ ...existing, positionSlot: "ZAG1" });

      const result = await service.update("1", { positionSlot: "ZAG1" });

      expect(result).toBeDefined();
    });
  });

  describe("delete", () => {
    it("should delete lineup player", async () => {
      const lp = { id: "1" };
      mockFindOne.mockResolvedValue(lp);
      mockRemove.mockResolvedValue(undefined);

      await service.delete("1");

      expect(mockRemove).toHaveBeenCalledWith(lp);
    });

    it("should throw 404", async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(service.delete("1")).rejects.toThrow(AppError);
    });
  });
});
