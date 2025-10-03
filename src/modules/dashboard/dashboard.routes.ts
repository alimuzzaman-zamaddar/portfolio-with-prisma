import express from "express";
import { DashboardController } from "./dashboard.controller";
import { auth } from "../../middleware/auth";

const router = express.Router();

router.get("/stats", auth("OWNER"), DashboardController.getDashboardStats); 
router.get("/overview", auth("OWNER"), DashboardController.getContentOverview);

export const dashboardRouter = router;
