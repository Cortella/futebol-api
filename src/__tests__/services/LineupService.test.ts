const mockCreate = jest.fn();
const mockSave = jest.fn();
const mockFindOne = jest.fn();
const mockFind = jest.fn();
const mockRemove = jest.fn();
const mockDelete = jest.fn();

const mockLpCreate = jest.fn();
const mockLpSave = jest.fn();
const mockLpFind = jest.fn();
const mockLpDelete = jest.fn();

jest.mock("../../config/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockImplementation((entity: any) => {
      const name = typeof entity === "function" ? entity.name : entity;

      if (name === "LineupPlayer") {
        return {
          create: mockLpCreate,
          save: mockLpSave,
          find: mockLpFind,
          delete: mockLpDelete,
        };
      }

      return {
        create: mockCreate,
        save: mockSave,
        findOne: mockFindOne,
        find: mockFind,
        remove: mockRemove,
        delete: mockDelete,
      };
    }),
  },
}));

jest.mock("../../config/env", () => ({
  env: { jwt: { secret: "test-secret", expiresIn: "7d" } },
}));

import { LineupService } from "../../services/LineupService";
import { AppError } from "../../errors/AppError";

describe("LineupService", () => {
  let service: LineupService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new LineupService();
  });

  describe("findByCareer", () => {
    it("should return lineups for career", async () => {
      const lineups = [{ id: "1" }];
      mockFind.mockResolvedValue(lineups);

      const result = await service.findByCareer("c1");

      expect(result).toEqual(lineups);
      expect(mockFind).toHaveBeenCalledWith({
        where: { careerId: "c1" },
        order: { name: "ASC" },
      });
    });
  });

  describe("findById", () => {
    it("should return lineup when found", async () => {
      const lineup = { id: "1" };
      mockFindOne.mockResolvedValue(lineup);

      const result = await service.findById("1");

      expect(result).toEqual(lineup);
    });

    it("should throw 404", async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(service.findById("1")).rejects.toThrow("Lineup not found");
    });
  });

  describe("create", () => {
    it("should create lineup with name", async () => {
      const created = { id: "1", careerId: "c1", name: "Test" };
      mockCreate.mockReturnValue(created);
      mockSave.mockResolvedValue(created);

      const result = await service.create({ careerId: "c1", name: "Test" });

      expect(result).toEqual(created);
    });

    it("should create lineup with null name", async () => {
      mockCreate.mockReturnValue({});
      mockSave.mockResolvedValue({});

      await service.create({ careerId: "c1" });

      expect(mockCreate).toHaveBeenCalledWith({ careerId: "c1", name: null });
    });
  });

  describe("update", () => {
    it("should update lineup name", async () => {
      const existing = { id: "1", name: "Old" };
      mockFindOne.mockResolvedValue(existing);
      mockSave.mockResolvedValue({ ...existing, name: "New" });

      const result = await service.update("1", { name: "New" });

      expect(result).toBeDefined();
    });

    it("should set name to null", async () => {
      const existing = { id: "1", name: "Old" };
      mockFindOne.mockResolvedValue(existing);
      mockSave.mockResolvedValue({ ...existing, name: null });

      await service.update("1", { name: null });

      expect(mockSave).toHaveBeenCalled();
    });

    it("should keep existing name when undefined", async () => {
      const existing = { id: "1", name: "Keep" };
      mockFindOne.mockResolvedValue(existing);
      mockSave.mockResolvedValue(existing);

      await service.update("1", {});

      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should delete lineup", async () => {
      const lineup = { id: "1" };
      mockFindOne.mockResolvedValue(lineup);
      mockRemove.mockResolvedValue(undefined);

      await service.delete("1");

      expect(mockRemove).toHaveBeenCalledWith(lineup);
    });

    it("should throw 404", async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(service.delete("1")).rejects.toThrow(AppError);
    });
  });

  describe("getLineupWithPlayers", () => {
    it("should return lineup with players", async () => {
      const lineup = { id: "l1" };
      mockFindOne.mockResolvedValue(lineup);
      const players = [{ id: "lp1", playerId: "p1" }];
      mockLpFind.mockResolvedValue(players);

      const result = await service.getLineupWithPlayers("c1");

      expect(result).toEqual({ lineup, players });
      expect(mockLpFind).toHaveBeenCalledWith({
        where: { lineupId: "l1" },
        relations: ["player"],
        order: { isStarter: "DESC", positionSlot: "ASC" },
      });
    });

    it("should return null when no lineup exists", async () => {
      mockFindOne.mockResolvedValue(null);

      const result = await service.getLineupWithPlayers("c1");

      expect(result).toBeNull();
    });
  });

  describe("setLineup", () => {
    const data = {
      name: "Titular",
      starters: [
        { playerId: "p1", positionSlot: "GOL1" },
        { playerId: "p2", positionSlot: "ZAG1" },
        { playerId: "p3", positionSlot: "ZAG2" },
        { playerId: "p4", positionSlot: "LD1" },
        { playerId: "p5", positionSlot: "LE1" },
        { playerId: "p6", positionSlot: "VOL1" },
        { playerId: "p7", positionSlot: "VOL2" },
        { playerId: "p8", positionSlot: "MEI1" },
        { playerId: "p9", positionSlot: "MEI2" },
        { playerId: "p10", positionSlot: "ATA1" },
        { playerId: "p11", positionSlot: "ATA2" },
      ],
      reserves: [{ playerId: "p12", positionSlot: "GOL2" }],
    };

    it("should create new lineup and players", async () => {
      mockFindOne.mockResolvedValue(null);
      const newLineup = { id: "l1", careerId: "c1", name: "Titular" };
      mockCreate.mockReturnValue(newLineup);
      mockSave.mockResolvedValueOnce(newLineup);
      mockLpDelete.mockResolvedValue(undefined);
      mockLpCreate.mockImplementation((d: any) => d);
      const savedPlayers = data.starters
        .map((s) => ({ ...s, isStarter: true, lineupId: "l1" }))
        .concat(data.reserves.map((r) => ({ ...r, isStarter: false, lineupId: "l1" })));
      mockLpSave.mockResolvedValue(savedPlayers);

      const result = await service.setLineup("c1", data);

      expect(result.lineup).toEqual(newLineup);
      expect(result.players).toEqual(savedPlayers);
      expect(mockLpDelete).toHaveBeenCalledWith({ lineupId: "l1" });
    });

    it("should update existing lineup", async () => {
      const existingLineup = { id: "l1", careerId: "c1", name: "Old" };
      mockFindOne.mockResolvedValue(existingLineup);
      mockSave.mockResolvedValue({ ...existingLineup, name: "Titular" });
      mockLpDelete.mockResolvedValue(undefined);
      mockLpCreate.mockImplementation((d: any) => d);
      mockLpSave.mockResolvedValue([]);

      const result = await service.setLineup("c1", data);

      expect(result.lineup).toBeDefined();
      expect(mockLpDelete).toHaveBeenCalledWith({ lineupId: "l1" });
    });

    it("should update existing lineup without name change", async () => {
      const existingLineup = { id: "l1", careerId: "c1", name: "Keep" };
      mockFindOne.mockResolvedValue(existingLineup);
      mockLpDelete.mockResolvedValue(undefined);
      mockLpCreate.mockImplementation((d: any) => d);
      mockLpSave.mockResolvedValue([]);

      const dataNoName = { ...data, name: undefined };

      const result = await service.setLineup("c1", dataNoName);

      expect(result.lineup).toBeDefined();
    });
  });
});
