import mongoose, { Schema } from "mongoose";

export interface CharityDocument {
  name: string;
  description?: string;
  image?: string;
  website?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<CharityDocument>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true, maxlength: 1000 },
    image: { type: String, trim: true },
    website: { type: String, trim: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Charity = mongoose.model<CharityDocument>("Charity", schema);
