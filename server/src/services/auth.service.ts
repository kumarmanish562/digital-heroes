import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { publicUser } from "../utils/apiResponse.js";

export async function registerUser(name: string, email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const exists = await User.exists({ email: normalizedEmail });
  if (exists) throw Object.assign(new Error("Email is already registered"), { status: 409, code: "EMAIL_EXISTS" });
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash, role: "USER", active: true });
  return { token: signToken({ userId: String(user._id), role: user.role }), user: { userId: String(user._id), role: user.role }, profile: publicUser(user) };
}

export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+passwordHash");
  if (!user || !user.active) throw Object.assign(new Error("Invalid email or password"), { status: 401, code: "INVALID_CREDENTIALS" });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw Object.assign(new Error("Invalid email or password"), { status: 401, code: "INVALID_CREDENTIALS" });
  return { token: signToken({ userId: String(user._id), role: user.role }), user: { userId: String(user._id), role: user.role }, profile: publicUser(user) };
}
