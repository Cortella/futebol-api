const mockFindAll = jest.fn();
const mockFindById = jest.fn();
const mockCreateTeam = jest.fn();
const mockUpdateTeam = jest.fn();
const mockDeleteTeam = jest.fn();

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

jest.mock("../../services/TeamService", () => ({
  TeamService: jest.fn().mockImplementation(() => ({
    findAll: mockFindAll,
    findById: mockFindById,
    create: mockCreateTeam,
    update: mockUpdateTeam,
    delete: mockDeleteTeam,
  })),
}));

import { TeamController } from "../../controllers/TeamController";
import { Request, Response } from "express";

const mockJson = jest.fn();
const mockStatus = jest.fn().mockReturnValue({ json: mockJson, send: jest.fn() });
const mockSend = jest.fn();

const createRes = () =>
  ({
    json: mockJson,
    status: mockStatus,
    send: mockSend,
  }) as unknown as Response;

describe("TeamController", () => {
  let controller: TeamController;

  beforeEach(() => {
    controller = new TeamController();
    jest.clearAllMocks();
    mockStatus.mockReturnValue({ json: mockJson, send: mockSend });
  });

  describe("index", () => {
    it("should return all teams", async () => {
      const teams = [{ id: "1", name: "Flamengo" }];
      mockFindAll.mockResolvedValue(teams);

      const req = {} as Request;
      const res = createRes();

      await controller.index(req, res);

      expect(mockJson).toHaveBeenCalledWith(teams);
    });
  });

  describe("show", () => {
    it("should return a team by id", async () => {
      const team = { id: "1", name: "Flamengo" };
      mockFindById.mockResolvedValue(team);

      const req = { params: { id: "1" } } as unknown as Request<{ id: string }>;
      const res = createRes();

      await controller.show(req, res);

      expect(mockFindById).toHaveBeenCalledWith("1");
      expect(mockJson).toHaveBeenCalledWith(team);
    });
  });

  describe("store", () => {
    it("should create a team and return 201", async () => {
      const data = {
        name: "Flamengo",
        city: "Rio de Janeiro",
        stadium: "Maracanã",
        foundedYear: 1895,
      };
      const created = { ...data, id: "1" };
      mockCreateTeam.mockResolvedValue(created);

      const req = { body: data } as Request;
      const res = createRes();

      await controller.store(req, res);

      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(created);
    });
  });

  describe("update", () => {
    it("should update a team", async () => {
      const updated = { id: "1", name: "Flamengo RJ" };
      mockUpdateTeam.mockResolvedValue(updated);

      const req = {
        params: { id: "1" },
        body: { name: "Flamengo RJ" },
      } as unknown as Request<{ id: string }>;
      const res = createRes();

      await controller.update(req, res);

      expect(mockUpdateTeam).toHaveBeenCalledWith("1", { name: "Flamengo RJ" });
      expect(mockJson).toHaveBeenCalledWith(updated);
    });
  });

  describe("destroy", () => {
    it("should delete a team and return 204", async () => {
      mockDeleteTeam.mockResolvedValue(undefined);

      const req = { params: { id: "1" } } as unknown as Request<{ id: string }>;
      const res = createRes();

      await controller.destroy(req, res);

      expect(mockDeleteTeam).toHaveBeenCalledWith("1");
      expect(mockStatus).toHaveBeenCalledWith(204);
    });
  });
});
