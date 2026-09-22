import type { Request, Response } from "express";
import { z } from "zod";
import { loginUser, registerUser } from "../services/auth.service.js";
import { ok } from "../utils/apiResponse.js";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(128)
});

export async function register(req: Request, res: Response) {
  const body = z.object({ name: z.string().min(2).max(80), email: z.string().email(), password: z.string().min(6).max(128) }).parse(req.body);
  const result = await registerUser(body.name, body.email, body.password);
  return ok(res, { token: result.token, user: result.user }, "Account created", 201);
}

export async function login(req: Request, res: Response) {
  const body = authSchema.parse(req.body);
  const result = await loginUser(body.email, body.password);
  return ok(res, { token: result.token, user: result.user }, "Login successful");
}

export async function me(req: Request, res: Response) {
  return ok(res, req.auth, "Authenticated user");
}

export async function logout(_req: Request, res: Response) {
  return ok(res, null, "Logged out");
}
