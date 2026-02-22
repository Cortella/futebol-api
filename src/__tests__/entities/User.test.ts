import { User } from "../../entities/User";

describe("User entity", () => {
  it("should create a User instance with correct properties", () => {
    const user = new User();
    user.id = "test-uuid";
    user.username = "cortella";
    user.email = "cortella@email.com";
    user.password = "hashed-password";
    user.createdAt = new Date("2024-01-01");

    expect(user.id).toBe("test-uuid");
    expect(user.username).toBe("cortella");
    expect(user.email).toBe("cortella@email.com");
    expect(user.password).toBe("hashed-password");
    expect(user.createdAt).toEqual(new Date("2024-01-01"));
  });

  it("should allow creating User without optional fields initially", () => {
    const user = new User();
    expect(user.id).toBeUndefined();
    expect(user.username).toBeUndefined();
    expect(user.email).toBeUndefined();
    expect(user.password).toBeUndefined();
    expect(user.createdAt).toBeUndefined();
  });
});
