import mongoose, { Schema } from "mongoose";

export interface CharitySelectionDocument {
  user: mongoose.Types.ObjectId;
  charity: mongoose.Types.ObjectId;
  contributionPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<CharitySelectionDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    charity: { type: Schema.Types.ObjectId, ref: "Charity", required: true },
    contributionPercentage: { type: Number, required: true, min: 10, max: 100 }
  },
  { timestamps: true }
);

export const CharitySelection = mongoose.model<CharitySelectionDocument>("CharitySelection", schema);
