import express from "express";
import { PostController } from "./post.controller";
import { auth } from "../../middleware/auth";

const router = express.Router();

// Public Routes
router.get("/", PostController.getAllPosts); // Get all published posts
router.get("/featured", PostController.getFeaturedPosts); // Get featured posts
router.get("/recent", PostController.getRecentPosts); // Get recent posts
router.get("/slug/:slug", PostController.getPostBySlug); // Get post by slug
router.get("/:id", PostController.getPostById); // Get post by ID

// Owner-Only Routes (Authenticated)
router.post("/", auth("OWNER"), PostController.createPost); // Create new post
router.put("/:id", auth("OWNER"), PostController.updatePost); // Update post
router.delete("/:id", auth("OWNER"), PostController.deletePost); // Delete post
router.get("/admin/stats", auth("OWNER"), PostController.getBlogStats); // Get blog statistics

export const postRouter = router;
