import type { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  logger.error("Unhandled request error", err);
  const status = typeof err?.status === "number" ? err.status : 500;
  const code = typeof err?.code === "string" ? err.code : "INTERNAL_ERROR";
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(422).json({ success: false, message: "Validation failed", data: null, error: { code: "VALIDATION_ERROR", details: err.message } });
  }
  if (err?.code === 11000) {
    return res.status(409).json({ success: false, message: "A record with those values already exists", data: null, error: { code: "DUPLICATE" } });
  }
  return res.status(status).json({ success: false, message: err?.message || "Internal server error", data: null, error: { code } });
};
