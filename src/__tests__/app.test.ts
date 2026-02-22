jest.mock("../config/data-source", () => ({
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

describe("app", () => {
  it("should export an express app with middleware and routes", () => {
    const { app } = require("../app");
    expect(app).toBeDefined();
    expect(typeof app).toBe("function");
    expect(typeof app.listen).toBe("function");
    expect(typeof app.use).toBe("function");
  });
});
