import { Router } from "express";
import { getMe, updateProfile } from "../controllers/userController";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken";
import { authLimiter } from "../middleware/rateLimiter";
import { validate } from "../middleware/validate";
import { updateProfileSchema } from "../schemas/user.schema";

const router = Router();

/**
 * @route   GET /api/users/me
 * @desc    Retrieve the authenticated user's own profile
 * @access  Private (Requires valid Firebase Bearer Token)
 */
router.get("/me", verifyFirebaseToken, getMe);

/**
 * @route   PATCH /api/users/me
 * @desc    Update the authenticated user's name, phone, and/or address
 * @access  Private (Requires valid Firebase Bearer Token)
 */
router.patch(
  "/me",
  authLimiter,
  verifyFirebaseToken,
  validate(updateProfileSchema),
  updateProfile,
);

export default router;
