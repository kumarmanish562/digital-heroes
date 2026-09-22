import type { Request, Response } from "express";
import { z } from "zod";
import { User } from "../models/User.js";
import { cancelSubscription, checkout, getCurrentSubscription, getPlans } from "../services/subscription.service.js";
import { ok } from "../utils/apiResponse.js";

export async function plans(_req: Request, res: Response) { return ok(res, getPlans(), "Plans loaded"); }
export async function current(req: Request, res: Response) { return ok(res, await getCurrentSubscription(req.auth!.userId), "Subscription loaded"); }
export async function createCheckout(req: Request, res: Response) {
  const { plan } = z.object({ plan: z.enum(["MONTHLY", "YEARLY"]) }).parse(req.body);
  const user = await User.findById(req.auth!.userId).lean();
  if (!user) throw Object.assign(new Error("User not found"), { status: 404, code: "NOT_FOUND" });
  return ok(res, await checkout(String(user._id), user.email, plan), "Checkout ready");
}
export async function cancel(req: Request, res: Response) { return ok(res, await cancelSubscription(req.auth!.userId), "Subscription cancelled"); }
