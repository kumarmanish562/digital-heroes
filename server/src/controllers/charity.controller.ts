import type { Request, Response } from "express";
import { z } from "zod";
import { listCharities, getMyCharity, selectCharity } from "../services/charity.service.js";
import { ok } from "../utils/apiResponse.js";

export async function list(_req: Request, res: Response) { return ok(res, await listCharities(), "Charities loaded"); }
export async function mine(req: Request, res: Response) { return ok(res, await getMyCharity(req.auth!.userId), "Charity selection loaded"); }
export async function select(req: Request, res: Response) {
  const b = z.object({ charityId: z.string(), contributionPercentage: z.number().min(10).max(100) }).parse(req.body);
  return ok(res, await selectCharity(req.auth!.userId, b.charityId, b.contributionPercentage), "Charity selection saved");
}
