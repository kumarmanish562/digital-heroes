import mongoose, { Schema } from "mongoose";

export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED";
export type PaymentStatus = "PENDING" | "PAID";

export interface WinnerDocument {
  draw: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  entry: mongoose.Types.ObjectId;
  matchCount: number;
  prizeAmount: number;
  verificationStatus: VerificationStatus;
  paymentStatus: PaymentStatus;
  proofUrl?: string;
  rejectionReason?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<WinnerDocument>(
  {
    draw: { type: Schema.Types.ObjectId, ref: "Draw", required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    entry: { type: Schema.Types.ObjectId, ref: "Score", required: true },
    matchCount: { type: Number, required: true, min: 1, max: 5 },
    prizeAmount: { type: Number, required: true, min: 0 },
    verificationStatus: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
    paymentStatus: { type: String, enum: ["PENDING", "PAID"], default: "PENDING" },
    proofUrl: String,
    rejectionReason: String,
    paidAt: Date
  },
  { timestamps: true }
);

schema.index({ draw: 1, user: 1 }, { unique: true });

export const Winner = mongoose.model<WinnerDocument>("Winner", schema);
