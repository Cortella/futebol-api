jest.mock("swagger-jsdoc", () => {
  return jest.fn().mockReturnValue({ openapi: "3.0.0" });
});

describe("swagger config", () => {
  it("should export swaggerSpec as an object", () => {
    const { swaggerSpec } = require("../../config/swagger");

    expect(swaggerSpec).toBeDefined();
    expect(swaggerSpec).toEqual({ openapi: "3.0.0" });
  });

  it("should call swagger-jsdoc with correct options", () => {
    const swaggerJsdoc = require("swagger-jsdoc");

    expect(swaggerJsdoc).toHaveBeenCalledWith(
      expect.objectContaining({
        definition: expect.objectContaining({
          openapi: "3.0.0",
          info: expect.objectContaining({
            title: "FutManager API",
          }),
          paths: expect.objectContaining({
            "/health": expect.any(Object),
            "/auth/register": expect.any(Object),
            "/auth/login": expect.any(Object),
          }),
          components: expect.objectContaining({
            securitySchemes: expect.objectContaining({
              bearerAuth: expect.any(Object),
            }),
            schemas: expect.objectContaining({
              User: expect.any(Object),
              RegisterInput: expect.any(Object),
              LoginInput: expect.any(Object),
              AuthResponse: expect.any(Object),
              Error: expect.any(Object),
              ValidationError: expect.any(Object),
            }),
          }),
        }),
      }),
    );
  });
});
