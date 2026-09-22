import mongoose from "mongoose";
import { Charity } from "../models/Charity.js";
import { CharitySelection } from "../models/CharitySelection.js";

export async function listCharities() {
  return Charity.find({ active: true }).sort({ name: 1 }).lean();
}

export async function getMyCharity(userId: string) {
  const selection = await CharitySelection.findOne({ user: userId }).populate("charity").lean();
  if (!selection) return null;
  const charity = selection.charity as unknown as { _id: mongoose.Types.ObjectId; name: string };
  return { charityId: String(charity._id), charityName: charity.name, contributionPercentage: selection.contributionPercentage };
}

export async function selectCharity(userId: string, charityId: string, contributionPercentage: number) {
  if (!mongoose.isValidObjectId(charityId)) throw Object.assign(new Error("Invalid charity id"), { status: 400, code: "INVALID_ID" });
  if (contributionPercentage < 10 || contributionPercentage > 100) throw Object.assign(new Error("Contribution must be between 10% and 100%"), { status: 422, code: "INVALID_PERCENTAGE" });
  const charity = await Charity.findOne({ _id: charityId, active: true });
  if (!charity) throw Object.assign(new Error("Charity not found"), { status: 404, code: "NOT_FOUND" });
  const selection = await CharitySelection.findOneAndUpdate(
    { user: userId },
    { charity: charity._id, contributionPercentage },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return { charityId: String(charity._id), charityName: charity.name, contributionPercentage: selection.contributionPercentage };
}
