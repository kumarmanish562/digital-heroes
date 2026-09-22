import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import scoreRoutes from "./routes/score.routes.js";
import charityRoutes from "./routes/charity.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import drawRoutes from "./routes/draw.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true, legacyHeaders: false }));

app.get("/", (_req, res) => res.json({ name: "Digital Heroes API", version: "2.0.0", status: "online" }));
app.get("/health", (_req, res) => res.status(200).json({ success: true, message: "Digital Heroes API is healthy", data: { status: "ok", version: "2.0.0" } }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/scores", scoreRoutes);
app.use("/api/v1/charities", charityRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/draws", drawRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use((_req, res) => res.status(404).json({ success: false, message: "Route not found", data: null, error: { code: "NOT_FOUND" } }));
app.use(errorMiddleware);

export default app;
