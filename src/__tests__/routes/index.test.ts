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

describe("routes index", () => {
  it("should export routes with /health and /auth", () => {
    const { routes } = require("../../routes/index");

    expect(routes).toBeDefined();

    const stack = routes.stack.filter((layer: any) => layer.route || layer.handle?.stack);

    const healthRoute = stack.find((layer: any) => layer.route && layer.route.path === "/health");
    expect(healthRoute).toBeDefined();

    const authMount = stack.find((layer: any) => layer.regexp && layer.regexp.test("/auth"));
    expect(authMount).toBeDefined();
  });
});
