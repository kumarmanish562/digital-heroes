import type { NextFunction, Request, Response } from "express";
import { fail } from "../utils/apiResponse.js";
import { verifyToken, type JwtPayload } from "../utils/jwt.js";

declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return fail(res, "Authentication required", 401, "UNAUTHORIZED");
  try {
    req.auth = verifyToken(header.slice(7));
    return next();
  } catch {
    return fail(res, "Invalid or expired token", 401, "UNAUTHORIZED");
  }
}
