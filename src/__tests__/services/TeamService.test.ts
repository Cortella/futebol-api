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

import { TeamService } from "../../services/TeamService";
import { AppError } from "../../errors/AppError";

describe("TeamService", () => {
  let service: TeamService;

  beforeEach(() => {
    service = new TeamService();
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("should return all teams with players", async () => {
      const teams = [{ id: "1", name: "Flamengo" }];
      mockFind.mockResolvedValue(teams);

      const result = await service.findAll();

      expect(result).toEqual(teams);
      expect(mockFind).toHaveBeenCalledWith({ relations: ["players"] });
    });
  });

  describe("findById", () => {
    it("should return a team when found", async () => {
      const team = { id: "1", name: "Flamengo" };
      mockFindOne.mockResolvedValue(team);

      const result = await service.findById("1");

      expect(result).toEqual(team);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: "1" },
        relations: ["players"],
      });
    });

    it("should throw AppError when team not found", async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(service.findById("999")).rejects.toThrow(AppError);
      await expect(service.findById("999")).rejects.toThrow("Team not found");
    });
  });

  describe("create", () => {
    it("should create and save a team", async () => {
      const data = {
        name: "Flamengo",
        city: "Rio de Janeiro",
        stadium: "Maracanã",
        foundedYear: 1895,
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
    it("should update and save a team", async () => {
      const existing = {
        id: "1",
        name: "Flamengo",
        city: "Rio",
        stadium: "Maracanã",
        foundedYear: 1895,
      };
      const updateData = { name: "Flamengo RJ" };
      const updated = { ...existing, ...updateData };

      mockFindOne.mockResolvedValue(existing);
      mockSave.mockResolvedValue(updated);

      const result = await service.update("1", updateData);

      expect(result).toEqual(updated);
      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should find and remove a team", async () => {
      const team = { id: "1", name: "Flamengo" };
      mockFindOne.mockResolvedValue(team);
      mockRemove.mockResolvedValue(team);

      await service.delete("1");

      expect(mockRemove).toHaveBeenCalledWith(team);
    });
  });
});
