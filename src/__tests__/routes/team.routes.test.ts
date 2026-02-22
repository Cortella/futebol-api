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

describe("team.routes", () => {
  it("should export teamRoutes as a Router", () => {
    const { teamRoutes } = require("../../routes/team.routes");
    expect(teamRoutes).toBeDefined();
    expect(typeof teamRoutes).toBe("function");

    const routes = teamRoutes.stack;
    expect(routes.length).toBe(5);

    const methods = routes.map((r: any) => Object.keys(r.route.methods)[0]);
    expect(methods).toContain("get");
    expect(methods).toContain("post");
    expect(methods).toContain("put");
    expect(methods).toContain("delete");
  });
});
