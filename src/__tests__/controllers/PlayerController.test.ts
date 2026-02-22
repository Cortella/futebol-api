const mockFindAll = jest.fn();
const mockFindById = jest.fn();
const mockFindByTeam = jest.fn();
const mockCreatePlayer = jest.fn();
const mockUpdatePlayer = jest.fn();
const mockDeletePlayer = jest.fn();

jest.mock("../../config/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockReturnValue({
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    }),
  },
}));

jest.mock("../../services/PlayerService", () => ({
  PlayerService: jest.fn().mockImplementation(() => ({
    findAll: mockFindAll,
    findById: mockFindById,
    findByTeam: mockFindByTeam,
    create: mockCreatePlayer,
    update: mockUpdatePlayer,
    delete: mockDeletePlayer,
  })),
}));

import { PlayerController } from "../../controllers/PlayerController";
import { Request, Response } from "express";

const mockJson = jest.fn();
const mockStatus = jest
  .fn()
  .mockReturnValue({ json: mockJson, send: jest.fn() });
const mockSend = jest.fn();

const createRes = () =>
  ({
    json: mockJson,
    status: mockStatus,
    send: mockSend,
  }) as unknown as Response;

describe("PlayerController", () => {
  let controller: PlayerController;

  beforeEach(() => {
    controller = new PlayerController();
    jest.clearAllMocks();
    mockStatus.mockReturnValue({ json: mockJson, send: mockSend });
  });

  describe("index", () => {
    it("should return all players", async () => {
      const players = [{ id: "1", name: "Gabigol" }];
      mockFindAll.mockResolvedValue(players);

      const req = {} as Request;
      const res = createRes();

      await controller.index(req, res);

      expect(mockJson).toHaveBeenCalledWith(players);
    });
  });

  describe("show", () => {
    it("should return a player by id", async () => {
      const player = { id: "1", name: "Gabigol" };
      mockFindById.mockResolvedValue(player);

      const req = { params: { id: "1" } } as unknown as Request<{ id: string }>;
      const res = createRes();

      await controller.show(req, res);

      expect(mockFindById).toHaveBeenCalledWith("1");
      expect(mockJson).toHaveBeenCalledWith(player);
    });
  });

  describe("byTeam", () => {
    it("should return players by team id", async () => {
      const players = [{ id: "1", name: "Gabigol" }];
      mockFindByTeam.mockResolvedValue(players);

      const req = { params: { teamId: "t1" } } as unknown as Request<{
        teamId: string;
      }>;
      const res = createRes();

      await controller.byTeam(req, res);

      expect(mockFindByTeam).toHaveBeenCalledWith("t1");
      expect(mockJson).toHaveBeenCalledWith(players);
    });
  });

  describe("store", () => {
    it("should create a player and return 201", async () => {
      const data = {
        name: "Gabigol",
        position: "Forward",
        number: 9,
        nationality: "Brazilian",
        birthDate: "1996-08-30",
      };
      const created = { ...data, id: "1" };
      mockCreatePlayer.mockResolvedValue(created);

      const req = { body: data } as Request;
      const res = createRes();

      await controller.store(req, res);

      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(created);
    });
  });

  describe("update", () => {
    it("should update a player", async () => {
      const updated = { id: "1", name: "Gabriel Barbosa" };
      mockUpdatePlayer.mockResolvedValue(updated);

      const req = {
        params: { id: "1" },
        body: { name: "Gabriel Barbosa" },
      } as unknown as Request<{ id: string }>;
      const res = createRes();

      await controller.update(req, res);

      expect(mockUpdatePlayer).toHaveBeenCalledWith("1", {
        name: "Gabriel Barbosa",
      });
      expect(mockJson).toHaveBeenCalledWith(updated);
    });
  });

  describe("destroy", () => {
    it("should delete a player and return 204", async () => {
      mockDeletePlayer.mockResolvedValue(undefined);

      const req = { params: { id: "1" } } as unknown as Request<{ id: string }>;
      const res = createRes();

      await controller.destroy(req, res);

      expect(mockDeletePlayer).toHaveBeenCalledWith("1");
      expect(mockStatus).toHaveBeenCalledWith(204);
    });
  });
});
