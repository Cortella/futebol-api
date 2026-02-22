import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../../middlewares/errorHandler";
import { AppError } from "../../errors/AppError";
import { z } from "zod";

const mockJson = jest.fn();
const mockStatus = jest.fn().mockReturnValue({ json: mockJson });

const createRes = () =>
  ({
    status: mockStatus,
    json: mockJson,
  }) as unknown as Response;

const createReq = () => ({}) as Request;
const next = jest.fn() as NextFunction;

describe("errorHandler middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStatus.mockReturnValue({ json: mockJson });
  });

  it("should handle AppError", () => {
    const error = new AppError("Not found", 404);
    const res = createRes();

    errorHandler(error, createReq(), res, next);

    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockJson).toHaveBeenCalledWith({
      status: "error",
      message: "Not found",
    });
  });

  it("should handle ZodError with issues array", () => {
    let zodError: any;
    try {
      z.string().parse(123);
    } catch (e) {
      zodError = e;
    }
    const res = createRes();

    errorHandler(zodError, createReq(), res, next);

    expect(mockStatus).toHaveBeenCalledWith(422);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({ status: "validation_error" }),
    );
  });

  it("should handle unexpected errors with 500", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    const error = new Error("Unexpected");
    const res = createRes();

    errorHandler(error, createReq(), res, next);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      status: "error",
      message: "Internal server error",
    });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
