import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { fail } from "../utils/apiResponse.js";

export function validateBody(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) return fail(res, "Invalid request body", 422, "VALIDATION_ERROR", result.error.flatten());
    req.body = result.data;
    return next();
  };
}
