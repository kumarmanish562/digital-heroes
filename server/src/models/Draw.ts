import mongoose, { Schema } from "mongoose";

export type DrawStatus = "DRAFT" | "SIMULATED" | "PUBLISHED";

export interface DrawDocument {
  drawDate: Date;
  numbers: number[];
  status: DrawStatus;
  prizePoolAmount: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<DrawDocument>(
  {
    drawDate: { type: Date, required: true, index: true },
    numbers: { type: [Number], default: [] },
    status: { type: String, enum: ["DRAFT", "SIMULATED", "PUBLISHED"], default: "DRAFT" },
    prizePoolAmount: { type: Number, required: true, min: 0 },
    publishedAt: Date
  },
  { timestamps: true }
);

export const Draw = mongoose.model<DrawDocument>("Draw", schema);
