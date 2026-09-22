import mongoose, { Schema, type HydratedDocument } from "mongoose";

export type UserRole = "USER" | "ADMIN";

export interface UserDocument {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const User = mongoose.model<UserDocument>("User", schema);
export type UserDoc = HydratedDocument<UserDocument>;
