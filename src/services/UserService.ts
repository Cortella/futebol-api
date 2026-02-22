import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { AppError } from "../errors/AppError";
import { env } from "../config/env";
import { RegisterInput } from "../schemas/auth.schema";

export class UserService {
  private get repository() {
    return AppDataSource.getRepository(User);
  }

  async register(data: RegisterInput): Promise<{ user: Omit<User, "password">; token: string }> {
    const existingByEmail = await this.repository.findOne({
      where: { email: data.email },
    });

    if (existingByEmail) {
      throw new AppError("Email already in use", 409);
    }

    const existingByUsername = await this.repository.findOne({
      where: { username: data.username },
    });

    if (existingByUsername) {
      throw new AppError("Username already in use", 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = this.repository.create({
      username: data.username,
      email: data.email,
      password: hashedPassword,
    });

    await this.repository.save(user);

    const token = this.generateToken(user);

    const { password: _, ...userWithoutPassword } = user as User & { password: string };

    return { user: userWithoutPassword, token };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: Omit<User, "password">; token: string }> {
    const user = await this.repository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email })
      .getOne();

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = this.generateToken(user);

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  private generateToken(user: User): string {
    return jwt.sign({ id: user.id, email: user.email, role: "user" }, env.jwt.secret, {
      expiresIn: env.jwt.expiresIn as unknown as number,
    });
  }
}
