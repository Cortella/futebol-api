import { Request, Response } from "express";
import { AuthController } from "../../controllers/AuthController";
import { AppError } from "../../errors/AppError";

jest.mock("../../config/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockReturnValue({
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(),
    }),
  },
}));

jest.mock("../../config/env", () => ({
  env: {
    jwt: { secret: "test-secret", expiresIn: "7d" },
  },
}));

jest.mock("../../services/UserService", () => ({
  UserService: jest.fn().mockImplementation(() => ({
    register: jest.fn(),
    login: jest.fn(),
  })),
}));

describe("AuthController", () => {
  let controller: AuthController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockRes = { status: mockStatus, json: mockJson };
    mockReq = { body: {} };
    controller = new AuthController();
  });

  describe("register", () => {
    it("should register user and return 201", async () => {
      const registerResult = {
        user: { id: "uuid-1", username: "cortella", email: "cortella@email.com" },
        token: "jwt-token",
      };

      (controller as any).userService.register.mockResolvedValue(registerResult);
      mockReq.body = { username: "cortella", email: "cortella@email.com", password: "senha123" };

      await controller.register(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(registerResult);
    });

    it("should throw ZodError for invalid input", async () => {
      mockReq.body = { username: "ab", email: "bad", password: "12" };

      await expect(controller.register(mockReq as Request, mockRes as Response)).rejects.toThrow();
    });

    it("should propagate AppError from service", async () => {
      (controller as any).userService.register.mockRejectedValue(
        new AppError("Email already in use", 409),
      );
      mockReq.body = { username: "cortella", email: "cortella@email.com", password: "senha123" };

      await expect(controller.register(mockReq as Request, mockRes as Response)).rejects.toThrow(
        "Email already in use",
      );
    });
  });

  describe("login", () => {
    it("should login and return 200", async () => {
      const loginResult = {
        user: { id: "uuid-1", username: "cortella", email: "cortella@email.com" },
        token: "jwt-token",
      };

      (controller as any).userService.login.mockResolvedValue(loginResult);
      mockReq.body = { email: "cortella@email.com", password: "senha123" };

      await controller.login(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(loginResult);
    });

    it("should throw ZodError for missing email", async () => {
      mockReq.body = { password: "senha123" };

      await expect(controller.login(mockReq as Request, mockRes as Response)).rejects.toThrow();
    });

    it("should propagate AppError from service", async () => {
      (controller as any).userService.login.mockRejectedValue(
        new AppError("Invalid credentials", 401),
      );
      mockReq.body = { email: "cortella@email.com", password: "senha123" };

      await expect(controller.login(mockReq as Request, mockRes as Response)).rejects.toThrow(
        "Invalid credentials",
      );
    });
  });
});
