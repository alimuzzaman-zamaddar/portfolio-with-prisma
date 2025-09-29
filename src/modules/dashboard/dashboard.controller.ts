import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";

// Get dashboard statistics (owner only)
const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const stats = await DashboardService.getDashboardStats();

    return res.status(200).json({
      success: true,
      message: "Dashboard statistics retrieved successfully",
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching dashboard statistics",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Get content overview (owner only)
const getContentOverview = async (req: Request, res: Response) => {
  try {
    const overview = await DashboardService.getContentOverview();

    return res.status(200).json({
      success: true,
      message: "Content overview retrieved successfully",
      data: overview,
    });
  } catch (error) {
    console.error("Error fetching content overview:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching content overview",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const DashboardController = {
  getDashboardStats,
  getContentOverview,
};
