import express from "express";
import { ProjectController } from "./project.controller";
import { auth } from "../../middleware/auth";

const router = express.Router();

// Public Routes
router.get("/", ProjectController.getAllProjects); // Get all published projects
router.get("/featured", ProjectController.getFeaturedProjects); // Get featured projects
router.get("/slug/:slug", ProjectController.getProjectBySlug); // Get project by slug
router.get("/:id", ProjectController.getProjectById); // Get project by ID

// Owner-Only Routes (Authenticated)
router.post("/", auth("OWNER"), ProjectController.createProject); // Create new project
router.put("/:id", auth("OWNER"), ProjectController.updateProject); // Update project
router.delete("/:id", auth("OWNER"), ProjectController.deleteProject); // Delete project
router.get("/admin/stats", auth("OWNER"), ProjectController.getProjectStats); // Get project statistics

export const projectRouter = router;
