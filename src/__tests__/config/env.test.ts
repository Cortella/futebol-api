describe("env config", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should use default values when env vars are not set", () => {
    delete process.env.NODE_ENV;
    delete process.env.PORT;
    delete process.env.DB_HOST;
    delete process.env.DB_PORT;
    delete process.env.DB_USERNAME;
    delete process.env.DB_PASSWORD;
    delete process.env.DB_DATABASE;

    jest.mock("dotenv/config", () => ({}));

    const { env } = require("../../config/env");

    expect(env.nodeEnv).toBe("development");
    expect(env.port).toBe(3333);
    expect(env.db.host).toBe("localhost");
    expect(env.db.port).toBe(5432);
    expect(env.db.username).toBe("postgres");
    expect(env.db.password).toBe("postgres");
    expect(env.db.database).toBe("futebol_db");
  });

  it("should use environment variables when set", () => {
    process.env.NODE_ENV = "production";
    process.env.PORT = "4000";
    process.env.DB_HOST = "remotehost";
    process.env.DB_PORT = "5433";
    process.env.DB_USERNAME = "admin";
    process.env.DB_PASSWORD = "secret";
    process.env.DB_DATABASE = "prod_db";

    jest.mock("dotenv/config", () => ({}));

    const { env } = require("../../config/env");

    expect(env.nodeEnv).toBe("production");
    expect(env.port).toBe(4000);
    expect(env.db.host).toBe("remotehost");
    expect(env.db.port).toBe(5433);
    expect(env.db.username).toBe("admin");
    expect(env.db.password).toBe("secret");
    expect(env.db.database).toBe("prod_db");
  });
});
