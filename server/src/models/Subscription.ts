import mongoose, { Schema } from "mongoose";

export type SubscriptionPlan = "MONTHLY" | "YEARLY";
export type SubscriptionStatus = "PENDING" | "ACTIVE" | "CANCELLED" | "EXPIRED";

export interface SubscriptionDocument {
  user: mongoose.Types.ObjectId;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  amount: number;
  currency: string;
  startDate?: Date;
  renewalDate?: Date;
  cancelledAt?: Date;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  checkoutSessionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<SubscriptionDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    plan: { type: String, enum: ["MONTHLY", "YEARLY"], required: true },
    status: { type: String, enum: ["PENDING", "ACTIVE", "CANCELLED", "EXPIRED"], default: "PENDING" },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    startDate: Date,
    renewalDate: Date,
    cancelledAt: Date,
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    checkoutSessionId: String
  },
  { timestamps: true }
);

schema.index({ user: 1, status: 1 });

export const Subscription = mongoose.model<SubscriptionDocument>("Subscription", schema);
