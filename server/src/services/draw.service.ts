import mongoose from "mongoose";
import { Draw, type DrawDocument } from "../models/Draw.js";
import { Score } from "../models/Score.js";
import { Winner } from "../models/Winner.js";
import { env } from "../config/env.js";

function randomNumbers(count: number, max: number) {
  const values = new Set<number>();
  while (values.size < count) values.add(Math.floor(Math.random() * max) + 1);
  return [...values].sort((a, b) => a - b);
}

function matchCount(numbers: number[], drawNumbers: number[]) {
  return numbers.filter((n) => drawNumbers.includes(n)).length;
}

function prizeForMatch(match: number, pool: number) {
  const share = match === 5 ? 0.6 : match === 4 ? 0.25 : match === 3 ? 0.1 : 0.05;
  return Math.round(pool * share * 100) / 100;
}

export async function listDraws() {
  return Draw.find({ status: { $in: ["PUBLISHED", "SIMULATED"] } }).sort({ drawDate: -1 }).lean();
}

export async function currentDraw() {
  return Draw.findOne({ status: { $in: ["PUBLISHED", "SIMULATED"] } }).sort({ drawDate: -1 }).lean();
}

export async function getDraw(id: string) {
  if (!mongoose.isValidObjectId(id)) throw Object.assign(new Error("Invalid draw id"), { status: 400, code: "INVALID_ID" });
  const draw = await Draw.findOne({ _id: id, status: { $in: ["PUBLISHED", "SIMULATED"] } }).lean();
  if (!draw) throw Object.assign(new Error("Draw not found"), { status: 404, code: "NOT_FOUND" });
  return draw;
}

export async function createDraw(drawDate: string, prizePoolAmount: number) {
  return Draw.create({ drawDate: new Date(drawDate), prizePoolAmount, numbers: [], status: "DRAFT" });
}

export async function simulateDraw(id: string, prizePoolAmount?: number) {
  const draw = await Draw.findById(id);
  if (!draw) throw Object.assign(new Error("Draw not found"), { status: 404, code: "NOT_FOUND" });
  if (prizePoolAmount !== undefined) draw.prizePoolAmount = prizePoolAmount;
  draw.numbers = randomNumbers(env.DRAW_NUMBER_COUNT, env.DRAW_RANGE_MAX);
  draw.status = "SIMULATED";
  await draw.save();

  await Winner.deleteMany({ draw: draw._id });
  const aggregates = await Score.aggregate<{ _id: mongoose.Types.ObjectId; scores: number[]; scoreIds: mongoose.Types.ObjectId[] }>([
    { $sort: { scoreDate: -1, createdAt: -1 } },
    { $group: { _id: "$user", scores: { $push: "$score" }, scoreIds: { $push: "$_id" } } }
  ]);

  const winners = [];
  for (const user of aggregates) {
    const numbers = user.scores.slice(0, env.DRAW_NUMBER_COUNT).map(Number);
    if (numbers.length < env.DRAW_NUMBER_COUNT) continue;
    const matches = matchCount(numbers, draw.numbers);
    if (matches < 2) continue;
    winners.push({
      draw: draw._id,
      user: user._id,
      entry: user.scoreIds[0],
      matchCount: matches,
      prizeAmount: prizeForMatch(matches, draw.prizePoolAmount),
      verificationStatus: "PENDING" as const,
      paymentStatus: "PENDING" as const
    });
  }
  if (winners.length) await Winner.insertMany(winners, { ordered: false });
  return draw.toObject() as DrawDocument & { _id: mongoose.Types.ObjectId };
}

export async function publishDraw(id: string) {
  const draw = await Draw.findById(id);
  if (!draw) throw Object.assign(new Error("Draw not found"), { status: 404, code: "NOT_FOUND" });
  if (draw.status === "DRAFT") throw Object.assign(new Error("Simulate the draw before publishing"), { status: 422, code: "DRAW_NOT_SIMULATED" });
  draw.status = "PUBLISHED";
  draw.publishedAt = new Date();
  await draw.save();
  return draw;
}

export async function getUserWinnings(userId: string) {
  return Winner.find({ user: userId }).populate("draw").sort({ createdAt: -1 }).lean();
}
