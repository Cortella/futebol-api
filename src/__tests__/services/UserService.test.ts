import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserService } from "../../services/UserService";
import { AppError } from "../../errors/AppError";

const mockCreate = jest.fn();
const mockSave = jest.fn();
const mockFindOne = jest.fn();
const mockCreateQueryBuilder = jest.fn();

jest.mock("../../config/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockReturnValue({
      create: (...args: any[]) => mockCreate(...args),
      save: (...args: any[]) => mockSave(...args),
      findOne: (...args: any[]) => mockFindOne(...args),
      createQueryBuilder: (...args: any[]) => mockCreateQueryBuilder(...args),
    }),
  },
}));

jest.mock("../../config/env", () => ({
  env: {
    jwt: { secret: "test-secret", expiresIn: "7d" },
  },
}));

describe("UserService", () => {
  let service: UserService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UserService();
  });

  describe("register", () => {
    const validInput = {
      username: "cortella",
      email: "cortella@email.com",
      password: "senha123",
    };

    it("should register a new user and return user without password + token", async () => {
      mockFindOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
      mockCreate.mockReturnValue({
        id: "uuid-1",
        username: "cortella",
        email: "cortella@email.com",
        password: "hashed",
        createdAt: new Date(),
      });
      mockSave.mockResolvedValue(undefined);

      const result = await service.register(validInput);

      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect((result.user as any).password).toBeUndefined();
      expect(result.user.username).toBe("cortella");
      expect(result.user.email).toBe("cortella@email.com");
      expect(mockCreate).toHaveBeenCalled();
      expect(mockSave).toHaveBeenCalled();
    });

    it("should hash the password with salt 10", async () => {
      mockFindOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
      mockCreate.mockReturnValue({
        id: "uuid-1",
        username: "cortella",
        email: "cortella@email.com",
        password: "hashed",
        createdAt: new Date(),
      });
      mockSave.mockResolvedValue(undefined);

      const hashSpy = jest.spyOn(bcrypt, "hash") as jest.SpyInstance;

      await service.register(validInput);

      expect(hashSpy).toHaveBeenCalledWith("senha123", 10);
      hashSpy.mockRestore();
    });

    it("should throw 409 if email already in use", async () => {
      mockFindOne.mockResolvedValueOnce({ id: "existing", email: "cortella@email.com" });

      await expect(service.register(validInput)).rejects.toThrow(AppError);
      await expect(service.register(validInput)).rejects.toThrow("Email already in use");
    });

    it("should throw 409 if username already in use", async () => {
      mockFindOne.mockResolvedValueOnce(null).mockResolvedValueOnce({ id: "existing" });

      await expect(service.register(validInput)).rejects.toThrow("Username already in use");
    });

    it("should generate a valid JWT token", async () => {
      mockFindOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
      mockCreate.mockReturnValue({
        id: "uuid-1",
        username: "cortella",
        email: "cortella@email.com",
        password: "hashed",
        createdAt: new Date(),
      });
      mockSave.mockResolvedValue(undefined);

      const result = await service.register(validInput);

      const decoded = jwt.verify(result.token, "test-secret") as any;
      expect(decoded.id).toBe("uuid-1");
      expect(decoded.email).toBe("cortella@email.com");
      expect(decoded.role).toBe("user");
    });
  });

  describe("login", () => {
    it("should login with valid credentials and return user + token", async () => {
      const hashedPassword = await bcrypt.hash("senha123", 10);

      const mockQB = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({
          id: "uuid-1",
          username: "cortella",
          email: "cortella@email.com",
          password: hashedPassword,
          createdAt: new Date(),
        }),
      };
      mockCreateQueryBuilder.mockReturnValue(mockQB);

      const result = await service.login("cortella@email.com", "senha123");

      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect((result.user as any).password).toBeUndefined();
      expect(result.user.email).toBe("cortella@email.com");
    });

    it("should throw 401 if user not found", async () => {
      const mockQB = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      mockCreateQueryBuilder.mockReturnValue(mockQB);

      await expect(service.login("noone@email.com", "senha123")).rejects.toThrow(
        "Invalid credentials",
      );
    });

    it("should throw 401 if password does not match", async () => {
      const mockQB = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({
          id: "uuid-1",
          username: "cortella",
          email: "cortella@email.com",
          password: await bcrypt.hash("correct-password", 10),
          createdAt: new Date(),
        }),
      };
      mockCreateQueryBuilder.mockReturnValue(mockQB);

      await expect(service.login("cortella@email.com", "wrong-password")).rejects.toThrow(
        "Invalid credentials",
      );
    });
  });

  describe("findById", () => {
    it("should return user if found", async () => {
      const user = { id: "uuid-1", username: "cortella", email: "cortella@email.com" };
      mockFindOne.mockResolvedValue(user);

      const result = await service.findById("uuid-1");

      expect(result).toEqual(user);
      expect(mockFindOne).toHaveBeenCalledWith({ where: { id: "uuid-1" } });
    });

    it("should return null if user not found", async () => {
      mockFindOne.mockResolvedValue(null);

      const result = await service.findById("nonexistent");

      expect(result).toBeNull();
    });
  });
});
