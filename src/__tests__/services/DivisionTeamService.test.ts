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

import { DivisionTeamService } from "../../services/DivisionTeamService";
import { AppError } from "../../errors/AppError";

describe("DivisionTeamService", () => {
  let service: DivisionTeamService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new DivisionTeamService();
  });

  describe("findAll", () => {
    it("should return all division teams", async () => {
      const items = [{ id: "1" }];
      mockFind.mockResolvedValue(items);

      const result = await service.findAll();

      expect(result).toEqual(items);
      expect(mockFind).toHaveBeenCalledWith({ relations: ["division", "team"] });
    });
  });

  describe("findByDivision", () => {
    it("should return teams for division", async () => {
      const items = [{ id: "1" }];
      mockFind.mockResolvedValue(items);

      const result = await service.findByDivision("d1");

      expect(result).toEqual(items);
      expect(mockFind).toHaveBeenCalledWith({
        where: { divisionId: "d1" },
        relations: ["team"],
      });
    });
  });

  describe("findById", () => {
    it("should return division team when found", async () => {
      const dt = { id: "1" };
      mockFindOne.mockResolvedValue(dt);

      const result = await service.findById("1");

      expect(result).toEqual(dt);
    });

    it("should throw 404", async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(service.findById("1")).rejects.toThrow("DivisionTeam not found");
    });
  });

  describe("create", () => {
    it("should create division team", async () => {
      mockFindOne.mockResolvedValue(null);
      const created = { id: "1", divisionId: "d1", teamId: "t1", isUserTeam: false };
      mockCreate.mockReturnValue(created);
      mockSave.mockResolvedValue(created);

      const result = await service.create({
        divisionId: "d1",
        teamId: "t1",
        isUserTeam: false,
      });

      expect(result).toEqual(created);
    });

    it("should throw 409 if already assigned", async () => {
      mockFindOne.mockResolvedValue({ id: "existing" });

      await expect(
        service.create({ divisionId: "d1", teamId: "t1", isUserTeam: false }),
      ).rejects.toThrow("Team already assigned to this division");
    });
  });

  describe("update", () => {
    it("should update division team", async () => {
      const existing = { id: "1", isUserTeam: false };
      mockFindOne.mockResolvedValue(existing);
      mockSave.mockResolvedValue({ ...existing, isUserTeam: true });

      const result = await service.update("1", { isUserTeam: true });

      expect(result).toBeDefined();
    });
  });

  describe("delete", () => {
    it("should delete division team", async () => {
      const dt = { id: "1" };
      mockFindOne.mockResolvedValue(dt);
      mockRemove.mockResolvedValue(undefined);

      await service.delete("1");

      expect(mockRemove).toHaveBeenCalledWith(dt);
    });

    it("should throw 404", async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(service.delete("1")).rejects.toThrow(AppError);
    });
  });
});
