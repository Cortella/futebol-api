import { Request, Response, NextFunction } from "express";
import { authGuard, adminGuard, AuthRequest } from "../../middlewares/authGuard";
import { AppError } from "../../errors/AppError";

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

  it("should call next if valid Bearer token is provided", () => {
    mockReq.headers = { authorization: "Bearer valid-token-123" };

    authGuard(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
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
