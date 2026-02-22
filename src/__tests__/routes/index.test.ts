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

describe("routes/index", () => {
  it("should export routes with /teams, /players, and /health", () => {
    const { routes } = require("../../routes/index");
    expect(routes).toBeDefined();
    expect(typeof routes).toBe("function");

    const stack = routes.stack;
    expect(stack.length).toBe(3);
  });

  it("should respond to /health with status ok", () => {
    const { routes } = require("../../routes/index");

    const healthLayer = routes.stack.find(
      (layer: any) => layer.route && layer.route.path === "/health",
    );
    expect(healthLayer).toBeDefined();

    const handler = healthLayer.route.stack[0].handle;
    const mockJson = jest.fn();
    const req = {};
    const res = { json: mockJson };

    handler(req, res);

    expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({ status: "ok" }));
  });
});
