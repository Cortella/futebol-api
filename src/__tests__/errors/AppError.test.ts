import { AppError } from "../../errors/AppError";

describe("AppError", () => {
  it("should create an error with message and default status 400", () => {
    const error = new AppError("Something went wrong");
    expect(error.message).toBe("Something went wrong");
    expect(error.statusCode).toBe(400);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
  });

  it("should create an error with custom status code", () => {
    const error = new AppError("Not found", 404);
    expect(error.message).toBe("Not found");
    expect(error.statusCode).toBe(404);
  });
});
