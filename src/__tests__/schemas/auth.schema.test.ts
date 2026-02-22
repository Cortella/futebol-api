import { registerSchema, loginSchema } from "../../schemas/auth.schema";

describe("registerSchema", () => {
  it("should validate a correct register input", () => {
    const data = { username: "cortella", email: "cortella@email.com", password: "senha123" };
    const result = registerSchema.parse(data);

    expect(result.username).toBe("cortella");
    expect(result.email).toBe("cortella@email.com");
    expect(result.password).toBe("senha123");
  });

  it("should reject username shorter than 3 chars", () => {
    const data = { username: "ab", email: "test@email.com", password: "senha123" };

    expect(() => registerSchema.parse(data)).toThrow();
  });

  it("should reject username longer than 20 chars", () => {
    const data = {
      username: "a".repeat(21),
      email: "test@email.com",
      password: "senha123",
    };

    expect(() => registerSchema.parse(data)).toThrow();
  });

  it("should reject non-alphanumeric username", () => {
    const data = { username: "user@name", email: "test@email.com", password: "senha123" };

    expect(() => registerSchema.parse(data)).toThrow();
  });

  it("should reject invalid email", () => {
    const data = { username: "cortella", email: "not-an-email", password: "senha123" };

    expect(() => registerSchema.parse(data)).toThrow();
  });

  it("should reject password shorter than 6 chars", () => {
    const data = { username: "cortella", email: "test@email.com", password: "12345" };

    expect(() => registerSchema.parse(data)).toThrow();
  });

  it("should reject missing fields", () => {
    expect(() => registerSchema.parse({})).toThrow();
    expect(() => registerSchema.parse({ username: "test" })).toThrow();
    expect(() => registerSchema.parse({ username: "test", email: "t@t.com" })).toThrow();
  });
});

describe("loginSchema", () => {
  it("should validate a correct login input", () => {
    const data = { email: "cortella@email.com", password: "senha123" };
    const result = loginSchema.parse(data);

    expect(result.email).toBe("cortella@email.com");
    expect(result.password).toBe("senha123");
  });

  it("should reject invalid email", () => {
    expect(() => loginSchema.parse({ email: "bad", password: "senha123" })).toThrow();
  });

  it("should reject empty password", () => {
    expect(() => loginSchema.parse({ email: "test@test.com", password: "" })).toThrow();
  });

  it("should reject missing fields", () => {
    expect(() => loginSchema.parse({})).toThrow();
    expect(() => loginSchema.parse({ email: "t@t.com" })).toThrow();
  });
});
