import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authGuard, adminGuard, AuthRequest } from "../../middlewares/authGuard";
import { AppError } from "../../errors/AppError";

jest.mock("../../config/env", () => ({
  env: {
    jwt: { secret: "test-secret", expiresIn: "7d" },
  },
}));

describe("authGuard", () => {
  let mockReq: Partial<AuthRequest>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = { headers: {} };
    mockRes = {};
    mockNext = jest.fn();
  });

  it("should throw 401 if no authorization header", () => {
    expect(() => authGuard(mockReq as AuthRequest, mockRes as Response, mockNext)).toThrow(
      AppError,
    );

    expect(() => authGuard(mockReq as AuthRequest, mockRes as Response, mockNext)).toThrow(
      "Token not provided",
    );
  });

  it("should throw 401 if authorization header does not start with Bearer", () => {
    mockReq.headers = { authorization: "Basic abc123" };

    expect(() => authGuard(mockReq as AuthRequest, mockRes as Response, mockNext)).toThrow(
      AppError,
    );
  });

  it("should throw 401 if Bearer token is empty", () => {
    mockReq.headers = { authorization: "Bearer " };

    expect(() => authGuard(mockReq as AuthRequest, mockRes as Response, mockNext)).toThrow(
      "Token not provided",
    );
  });

  it("should call next and set req.user with valid JWT", () => {
    const payload = { id: "user-1", email: "test@test.com", role: "user" as const };
    const token = jwt.sign(payload, "test-secret");
    mockReq.headers = { authorization: `Bearer ${token}` };

    authGuard(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.user).toBeDefined();
    expect(mockReq.user!.id).toBe("user-1");
    expect(mockReq.user!.email).toBe("test@test.com");
    expect(mockReq.user!.role).toBe("user");
  });

  it("should throw 401 if token is invalid", () => {
    mockReq.headers = { authorization: "Bearer invalid-token-xyz" };

    expect(() => authGuard(mockReq as AuthRequest, mockRes as Response, mockNext)).toThrow(
      "Invalid or expired token",
    );
  });

  it("should throw 401 if token is expired", () => {
    const token = jwt.sign({ id: "user-1", email: "test@test.com", role: "user" }, "test-secret", {
      expiresIn: "0s",
    });
    mockReq.headers = { authorization: `Bearer ${token}` };

    expect(() => authGuard(mockReq as AuthRequest, mockRes as Response, mockNext)).toThrow(
      "Invalid or expired token",
    );
  });
});

describe("adminGuard", () => {
  let mockReq: Partial<AuthRequest>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = { headers: {} };
    mockRes = {};
    mockNext = jest.fn();
  });

  it("should throw 403 if no user on request", () => {
    expect(() => adminGuard(mockReq as AuthRequest, mockRes as Response, mockNext)).toThrow(
      AppError,
    );

    expect(() => adminGuard(mockReq as AuthRequest, mockRes as Response, mockNext)).toThrow(
      "Access denied. Admin privileges required",
    );
  });

  it("should throw 403 if user role is not admin", () => {
    mockReq.user = { id: "1", email: "user@test.com", role: "user" };

    expect(() => adminGuard(mockReq as AuthRequest, mockRes as Response, mockNext)).toThrow(
      "Access denied. Admin privileges required",
    );
  });

  it("should call next if user is admin", () => {
    mockReq.user = { id: "1", email: "admin@test.com", role: "admin" };

    adminGuard(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});
