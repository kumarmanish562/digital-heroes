import { Router } from "express";
import { getMe, updateMe } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const router = Router();
router.use(authenticate);
router.get("/me", asyncHandler(getMe));
router.put("/me", asyncHandler(updateMe));
export default router;
