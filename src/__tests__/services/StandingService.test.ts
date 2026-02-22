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

import { StandingService } from "../../services/StandingService";
import { AppError } from "../../errors/AppError";

describe("StandingService", () => {
  let service: StandingService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new StandingService();
  });

  describe("findByDivision", () => {
    it("should return standings for division", async () => {
      const standings = [{ id: "1" }];
      mockFind.mockResolvedValue(standings);

      const result = await service.findByDivision("d1");

      expect(result).toEqual(standings);
      expect(mockFind).toHaveBeenCalledWith({
        where: { divisionId: "d1" },
        relations: ["team"],
        order: { position: "ASC" },
      });
    });
  });

  describe("findById", () => {
    it("should return standing", async () => {
      const standing = { id: "1" };
      mockFindOne.mockResolvedValue(standing);

      const result = await service.findById("1");

      expect(result).toEqual(standing);
    });

    it("should throw 404", async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(service.findById("1")).rejects.toThrow("Standing not found");
    });
  });

  describe("create", () => {
    it("should create standing", async () => {
      const data = { divisionId: "d1", teamId: "t1" };
      mockCreate.mockReturnValue(data);
      mockSave.mockResolvedValue({ id: "1", ...data });

      const result = await service.create(data);

      expect(result).toBeDefined();
    });
  });

  describe("delete", () => {
    it("should delete standing", async () => {
      const standing = { id: "1" };
      mockFindOne.mockResolvedValue(standing);
      mockRemove.mockResolvedValue(undefined);

      await service.delete("1");

      expect(mockRemove).toHaveBeenCalledWith(standing);
    });

    it("should throw 404", async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(service.delete("1")).rejects.toThrow(AppError);
    });
  });
});
