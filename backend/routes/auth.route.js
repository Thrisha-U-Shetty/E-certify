import express from "express";
import {
  login,
  logout,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// 🔐 Protected route → requires token
router.get("/check-auth", verifyToken, checkAuth);

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// If logout only clears cookie, it won’t matter if you’re using header-based JWT
// 👉 Optional: keep it, but mostly frontend just deletes the stored token
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
