import mongoose, { Schema } from "mongoose";

export interface ScoreDocument {
  user: mongoose.Types.ObjectId;
  score: number;
  scoreDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<ScoreDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    score: { type: Number, required: true, min: 1, max: 45 },
    scoreDate: { type: Date, required: true }
  },
  { timestamps: true }
);

schema.index({ user: 1, scoreDate: -1 });

export const Score = mongoose.model<ScoreDocument>("Score", schema);
