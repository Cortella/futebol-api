import { Response, NextFunction, Router } from "express";
import { AdminController } from "../../controllers/AdminController";
import { AuthRequest } from "../../middlewares/authGuard";
import { AppError } from "../../errors/AppError";

jest.mock("../../middlewares/authGuard", () => ({
  authGuard: jest.fn((_req: AuthRequest, _res: Response, next: NextFunction) => next()),
  adminGuard: jest.fn((_req: AuthRequest, _res: Response, next: NextFunction) => next()),
}));

class TestAdminController extends AdminController {
  protected setupRoutes(): void {
    this.router.get("/test", (_req, res) => {
      res.json({ ok: true });
    });
  }
}

describe("AdminController", () => {
  let controller: TestAdminController;

  beforeEach(() => {
    controller = new TestAdminController();
  });

  it("should create a router instance", () => {
    expect(controller.router).toBeDefined();
  });

  it("should have setupRoutes called and register routes", () => {
    const routes = controller.router.stack;
    expect(routes.length).toBeGreaterThan(0);
  });

  describe("ensureAdmin", () => {
    it("should throw 403 if no user on request", () => {
      const mockReq = {} as AuthRequest;

      expect(() => (controller as any).ensureAdmin(mockReq)).toThrow(AppError);

      expect(() => (controller as any).ensureAdmin(mockReq)).toThrow(
        "Access denied. Admin privileges required",
      );
    });

    it("should throw 403 if user is not admin", () => {
      const mockReq = {
        user: { id: "1", email: "user@test.com", role: "user" },
      } as AuthRequest;

      expect(() => (controller as any).ensureAdmin(mockReq)).toThrow(
        "Access denied. Admin privileges required",
      );
    });

    it("should not throw if user is admin", () => {
      const mockReq = {
        user: { id: "1", email: "admin@test.com", role: "admin" },
      } as AuthRequest;

      expect(() => (controller as any).ensureAdmin(mockReq)).not.toThrow();
    });
  });

  describe("getUserId", () => {
    it("should throw 401 if no user on request", () => {
      const mockReq = {} as AuthRequest;

      expect(() => (controller as any).getUserId(mockReq)).toThrow(AppError);

      expect(() => (controller as any).getUserId(mockReq)).toThrow("User not authenticated");
    });

    it("should return user id if user exists", () => {
      const mockReq = {
        user: { id: "abc-123", email: "admin@test.com", role: "admin" },
      } as AuthRequest;

      const result = (controller as any).getUserId(mockReq);

      expect(result).toBe("abc-123");
    });
  });

  describe("response helpers", () => {
    let mockRes: Partial<Response>;

    beforeEach(() => {
      mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };
    });

    it("ok should respond with 200 and data", () => {
      (controller as any).ok(mockRes, { test: true });

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ test: true });
    });

    it("ok should respond with custom status code", () => {
      (controller as any).ok(mockRes, { test: true }, 202);

      expect(mockRes.status).toHaveBeenCalledWith(202);
    });

    it("created should respond with 201 and data", () => {
      (controller as any).created(mockRes, { id: "1" });

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ id: "1" });
    });

    it("noContent should respond with 204", () => {
      (controller as any).noContent(mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });
  });

  describe("handleAsync", () => {
    it("should call the wrapped function", async () => {
      const mockFn = jest.fn().mockResolvedValue(undefined);
      const wrapped = (controller as any).handleAsync(mockFn);

      const mockReq = {} as AuthRequest;
      const mockRes = {} as Response;
      const mockNext = jest.fn();

      await wrapped(mockReq, mockRes, mockNext);

      expect(mockFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    });

    it("should call next with error if function throws", async () => {
      const error = new Error("test error");
      const mockFn = jest.fn().mockRejectedValue(error);
      const wrapped = (controller as any).handleAsync(mockFn);

      const mockReq = {} as AuthRequest;
      const mockRes = {} as Response;
      const mockNext = jest.fn();

      await wrapped(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
