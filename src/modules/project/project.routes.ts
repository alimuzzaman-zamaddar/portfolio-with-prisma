import express from "express";
import { ProjectController } from "./project.controller";
import { auth } from "../../middleware/auth";

const router = express.Router();


router.get("/", ProjectController.getAllProjects); 
router.get("/featured", ProjectController.getFeaturedProjects); 
router.get("/slug/:slug", ProjectController.getProjectBySlug); 
router.get("/:id", ProjectController.getProjectById); 
router.post("/", auth("OWNER"), ProjectController.createProject); 
router.put("/:id", auth("OWNER"), ProjectController.updateProject); 
router.delete("/:id", auth("OWNER"), ProjectController.deleteProject); 
router.get("/admin/stats", auth("OWNER"), ProjectController.getProjectStats); 

export const projectRouter = router;
