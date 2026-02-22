jest.mock("../../config/env", () => ({
  env: {
    nodeEnv: "development",
    db: {
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "futebol_db",
    },
  },
}));

jest.mock("typeorm", () => ({
  DataSource: jest.fn().mockImplementation((options: any) => ({
    options,
  })),
}));

describe("data-source config", () => {
  it("should create a DataSource with correct config", () => {
    const { AppDataSource } = require("../../config/data-source");
    const { DataSource } = require("typeorm");

    expect(DataSource).toHaveBeenCalledTimes(1);

    const callArgs = (DataSource as jest.Mock).mock.calls[0][0];
    expect(callArgs.type).toBe("postgres");
    expect(callArgs.host).toBe("localhost");
    expect(callArgs.port).toBe(5432);
    expect(callArgs.username).toBe("postgres");
    expect(callArgs.password).toBe("postgres");
    expect(callArgs.database).toBe("futebol_db");
    expect(callArgs.synchronize).toBe(false);
    expect(callArgs.logging).toBe(true);
    expect(AppDataSource).toBeDefined();
  });
});
