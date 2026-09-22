import type { Request, Response } from "express";
import { z } from "zod";
import { User } from "../models/User.js";
import { ok } from "../utils/apiResponse.js";

export async function getMe(req: Request, res: Response) {
  const user = await User.findById(req.auth!.userId).lean();
  if (!user) throw Object.assign(new Error("User not found"), { status: 404, code: "NOT_FOUND" });
  return ok(res, { _id: String(user._id), id: String(user._id), name: user.name, email: user.email, role: user.role, active: user.active, createdAt: user.createdAt }, "Profile loaded");
}

export async function updateMe(req: Request, res: Response) {
  const { name } = z.object({ name: z.string().min(2).max(80) }).parse(req.body);
  const user = await User.findByIdAndUpdate(req.auth!.userId, { name: name.trim() }, { new: true }).lean();
  if (!user) throw Object.assign(new Error("User not found"), { status: 404, code: "NOT_FOUND" });
  return ok(res, { _id: String(user._id), id: String(user._id), name: user.name, email: user.email, role: user.role, active: user.active, createdAt: user.createdAt }, "Profile updated");
}
