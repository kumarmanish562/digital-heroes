import type { Request, Response } from "express";
import { z } from "zod";
import { createScore, deleteScore, listScores, updateScore } from "../services/score.service.js";
import { ok } from "../utils/apiResponse.js";

const schema = z.object({ score: z.number().int().min(1).max(45), scoreDate: z.string().min(8) });

export async function list(req: Request, res: Response) { return ok(res, await listScores(req.auth!.userId), "Scores loaded"); }
export async function create(req: Request, res: Response) { const b = schema.parse(req.body); return ok(res, await createScore(req.auth!.userId, b.score, b.scoreDate), "Score added", 201); }
export async function update(req: Request, res: Response) { const b = schema.parse(req.body); return ok(res, await updateScore(req.auth!.userId, String(req.params.id), b.score, b.scoreDate), "Score updated"); }
export async function remove(req: Request, res: Response) { return ok(res, await deleteScore(req.auth!.userId, String(req.params.id)), "Score deleted"); }
