import mongoose from "mongoose";
import { Score } from "../models/Score.js";

export async function listScores(userId: string) {
  return Score.find({ user: userId }).sort({ scoreDate: -1, createdAt: -1 }).limit(5).lean();
}

export async function createScore(userId: string, score: number, scoreDate: string) {
  if (score < 1 || score > 45) throw Object.assign(new Error("Score must be between 1 and 45"), { status: 422, code: "INVALID_SCORE" });
  const count = await Score.countDocuments({ user: userId });
  if (count >= 5) throw Object.assign(new Error("You can keep a maximum of five scores"), { status: 422, code: "SCORE_LIMIT" });
  return Score.create({ user: userId, score, scoreDate: new Date(scoreDate) });
}

export async function updateScore(userId: string, id: string, score: number, scoreDate: string) {
  if (!mongoose.isValidObjectId(id)) throw Object.assign(new Error("Invalid score id"), { status: 400, code: "INVALID_ID" });
  const item = await Score.findOneAndUpdate({ _id: id, user: userId }, { score, scoreDate: new Date(scoreDate) }, { new: true, runValidators: true });
  if (!item) throw Object.assign(new Error("Score not found"), { status: 404, code: "NOT_FOUND" });
  return item;
}

export async function deleteScore(userId: string, id: string) {
  const item = await Score.findOneAndDelete({ _id: id, user: userId });
  if (!item) throw Object.assign(new Error("Score not found"), { status: 404, code: "NOT_FOUND" });
  return item;
}
