import type { Request, Response } from "express";
import { getDraw, currentDraw, listDraws, getUserWinnings } from "../services/draw.service.js";
import { ok } from "../utils/apiResponse.js";

export async function list(_req: Request, res: Response) { return ok(res, await listDraws(), "Draws loaded"); }
export async function current(_req: Request, res: Response) { return ok(res, await currentDraw(), "Current draw loaded"); }
export async function details(req: Request, res: Response) { return ok(res, await getDraw(String(req.params.id)), "Draw loaded"); }
export async function winnings(req: Request, res: Response) { return ok(res, await getUserWinnings(req.auth!.userId), "Winnings loaded"); }
