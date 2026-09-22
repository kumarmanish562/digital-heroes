import type { NextFunction, Request, Response } from "express";
import { fail } from "../utils/apiResponse.js";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.auth?.role !== "ADMIN") return fail(res, "Admin access required", 403, "FORBIDDEN");
  return next();
}
