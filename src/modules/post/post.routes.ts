import express from "express";
import { PostController } from "./post.controller";
import { auth } from "../../middleware/auth";

const router = express.Router();

router.get("/", PostController.getAllPosts); 
router.get("/featured", PostController.getFeaturedPosts);
router.get("/recent", PostController.getRecentPosts); 
router.get("/slug/:slug", PostController.getPostBySlug); 
router.get("/:id", PostController.getPostById); 
router.post("/", auth("OWNER"), PostController.createPost); 
router.put("/:id", auth("OWNER"), PostController.updatePost); 
router.delete("/:id", auth("OWNER"), PostController.deletePost); 
router.get("/admin/stats", auth("OWNER"), PostController.getBlogStats); 

export const postRouter = router;
