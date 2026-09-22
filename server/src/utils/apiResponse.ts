import type { Response } from "express";

export function ok<T>(res: Response, data: T, message = "Success", status = 200) {
  return res.status(status).json({ success: true, message, data });
}

export function fail(res: Response, message: string, status = 400, code = "BAD_REQUEST", details?: unknown) {
  return res.status(status).json({
    success: false,
    message,
    data: null,
    error: { code, ...(details === undefined ? {} : { details }) }
  });
}

export function publicUser(user: { _id: unknown; name: string; email: string; role: string; active: boolean; createdAt?: Date }) {
  return {
    _id: String(user._id),
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    active: user.active,
    createdAt: user.createdAt
  };
}
