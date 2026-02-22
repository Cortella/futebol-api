import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { registerSchema, loginSchema } from "../schemas/auth.schema";

export class AuthController {
  private userService = new UserService();

  async register(req: Request, res: Response): Promise<void> {
    const data = registerSchema.parse(req.body);
    const result = await this.userService.register(data);

    res.status(201).json(result);
  }

  async login(req: Request, res: Response): Promise<void> {
    const data = loginSchema.parse(req.body);
    const result = await this.userService.login(data.email, data.password);

    res.status(200).json(result);
  }
}
