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

describe("auth routes", () => {
  it("should export authRouter with POST /register and POST /login", () => {
    const { authRouter } = require("../../routes/auth.routes");

    expect(authRouter).toBeDefined();

    const routes = authRouter.stack
      .filter((layer: any) => layer.route)
      .map((layer: any) => ({
        path: layer.route.path,
        methods: Object.keys(layer.route.methods),
      }));

    expect(routes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "/register", methods: ["post"] }),
        expect.objectContaining({ path: "/login", methods: ["post"] }),
      ]),
    );
  });
});
