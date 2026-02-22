jest.mock("../../config/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockReturnValue({
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    }),
  },
}));

describe("player.routes", () => {
  it("should export playerRoutes as a Router", () => {
    const { playerRoutes } = require("../../routes/player.routes");
    expect(playerRoutes).toBeDefined();
    expect(typeof playerRoutes).toBe("function");

    const routes = playerRoutes.stack;
    expect(routes.length).toBe(6);

    const methods = routes.map((r: any) => Object.keys(r.route.methods)[0]);
    expect(methods).toContain("get");
    expect(methods).toContain("post");
    expect(methods).toContain("put");
    expect(methods).toContain("delete");
  });
});
