import type { Request, Response } from "express";
import { z } from "zod";
import { User } from "../models/User.js";
import { Charity } from "../models/Charity.js";
import { Draw } from "../models/Draw.js";
import { Winner } from "../models/Winner.js";
import { createDraw, publishDraw, simulateDraw } from "../services/draw.service.js";
import { ok } from "../utils/apiResponse.js";

export async function dashboard(_req: Request, res: Response) {
  const [totalUsers, activeSubscriptions, totalDraws, pendingWinners] = await Promise.all([
    User.countDocuments(),
    (await import("../models/Subscription.js")).Subscription.countDocuments({ status: "ACTIVE" }),
    Draw.countDocuments(),
    Winner.countDocuments({ verificationStatus: "PENDING" })
  ]);
  return ok(res, { totalUsers, activeSubscriptions, totalDraws, pendingWinners }, "Admin dashboard loaded");
}

export async function users(_req: Request, res: Response) {
  const items = await User.find().sort({ createdAt: -1 }).lean();
  return ok(res, items.map(u => ({ _id: String(u._id), id: String(u._id), name: u.name, email: u.email, role: u.role, active: u.active, createdAt: u.createdAt })), "Users loaded");
}

export async function createAdminDraw(req: Request, res: Response) {
  const b = z.object({ drawDate: z.string().min(8), prizePoolAmount: z.number().min(0) }).parse(req.body);
  return ok(res, await createDraw(b.drawDate, b.prizePoolAmount), "Draw created", 201);
}

export async function simulate(req: Request, res: Response) {
  const b = z.object({ prizePoolAmount: z.number().min(0).optional() }).parse(req.body);
  return ok(res, await simulateDraw(String(req.params.id), b.prizePoolAmount), "Draw simulated");
}

export async function publish(req: Request, res: Response) { return ok(res, await publishDraw(String(req.params.id)), "Draw published"); }

export async function charities(_req: Request, res: Response) { return ok(res, await Charity.find().sort({ name: 1 }).lean(), "Charities loaded"); }

export async function createCharity(req: Request, res: Response) {
  const b = z.object({ name: z.string().min(2), description: z.string().optional(), image: z.string().optional(), website: z.string().optional(), active: z.boolean().optional() }).parse(req.body);
  return ok(res, await Charity.create(b), "Charity created", 201);
}

export async function updateCharity(req: Request, res: Response) {
  const b = z.object({ name: z.string().min(2).optional(), description: z.string().optional(), image: z.string().optional(), website: z.string().optional(), active: z.boolean().optional() }).parse(req.body);
  const charity = await Charity.findByIdAndUpdate(String(req.params.id), b, { new: true, runValidators: true });
  if (!charity) throw Object.assign(new Error("Charity not found"), { status: 404, code: "NOT_FOUND" });
  return ok(res, charity, "Charity updated");
}

export async function deleteCharity(req: Request, res: Response) {
  const charity = await Charity.findByIdAndUpdate(String(req.params.id), { active: false }, { new: true });
  if (!charity) throw Object.assign(new Error("Charity not found"), { status: 404, code: "NOT_FOUND" });
  return ok(res, charity, "Charity archived");
}

export async function winners(_req: Request, res: Response) {
  const items = await Winner.find().populate("user", "name email").populate("draw").sort({ createdAt: -1 }).lean();
  return ok(res, items, "Winners loaded");
}

export async function approve(req: Request, res: Response) {
  const item = await Winner.findByIdAndUpdate(String(req.params.id), { verificationStatus: "APPROVED", rejectionReason: undefined }, { new: true });
  if (!item) throw Object.assign(new Error("Winner not found"), { status: 404, code: "NOT_FOUND" });
  return ok(res, item, "Winner approved");
}

export async function reject(req: Request, res: Response) {
  const { reason } = z.object({ reason: z.string().min(2).max(500) }).parse(req.body);
  const item = await Winner.findByIdAndUpdate(String(req.params.id), { verificationStatus: "REJECTED", rejectionReason: reason }, { new: true });
  if (!item) throw Object.assign(new Error("Winner not found"), { status: 404, code: "NOT_FOUND" });
  return ok(res, item, "Winner rejected");
}

export async function pay(req: Request, res: Response) {
  const item = await Winner.findOneAndUpdate({ _id: String(req.params.id), verificationStatus: "APPROVED", paymentStatus: "PENDING" }, { paymentStatus: "PAID", paidAt: new Date() }, { new: true });
  if (!item) throw Object.assign(new Error("Winner must be approved before payment"), { status: 422, code: "NOT_READY_FOR_PAYMENT" });
  return ok(res, item, "Winner marked as paid");
}
