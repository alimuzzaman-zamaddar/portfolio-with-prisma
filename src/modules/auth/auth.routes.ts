import express from "express";
import { AuthController } from "./auth.controller";
import { auth } from "../../middleware/auth";

const router = express.Router();

// Public routes
router.post("/register", AuthController.register); // Register new user
router.post("/login", AuthController.login); // Login user
router.get("/verify", AuthController.verifyToken); // Verify token

// Protected routes
router.get("/profile", auth(), AuthController.getProfile); // Get current user profile

export const authRouter = router;
