import express from "express";
import { DashboardController } from "./dashboard.controller";
import { auth } from "../../middleware/auth";

const router = express.Router();

// Owner-Only Routes (Authenticated)
router.get("/stats", auth("OWNER"), DashboardController.getDashboardStats); // Get dashboard statistics
router.get("/overview", auth("OWNER"), DashboardController.getContentOverview); // Get content overview

export const dashboardRouter = router;
