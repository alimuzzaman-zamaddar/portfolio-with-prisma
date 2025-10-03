import { Request, Response } from "express";
import { PostService } from "./post.service";


const createPost = async (req: Request, res: Response) => {
  const {
    title,
    content,
    slug,
    excerpt,
    thumbnail,
    isFeatured,
    isPublished,
    tags,
  } = req.body;

  if (!title || !content || !slug) {
    return res.status(400).json({
      success: false,
      message: "Title, content, and slug are required",
    });
  }

  try {
    const post = await PostService.createPost({
      title,
      content,
      slug,
      excerpt,
      thumbnail,
      isFeatured: isFeatured || false,
      isPublished: isPublished !== false,
      tags: tags || [],
      author: {
        connect: { id: req.user?.id },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating post",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};


const getAllPosts = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      isFeatured,
      tags,
      isPublished = "true",
    } = req.query;

    const result = await PostService.getAllPosts({
      page: Number(page),
      limit: Number(limit),
      search: search as string,
      isFeatured:
        isFeatured === "true"
          ? true
          : isFeatured === "false"
          ? false
          : undefined,
      tags: tags
        ? Array.isArray(tags)
          ? (tags as string[])
          : [tags as string]
        : undefined,
      isPublished: isPublished === "true",
    });

    return res.status(200).json({
      success: true,
      message: "Posts retrieved successfully",
      ...result,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching posts",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

const getPostById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const post = await PostService.getPostById(Number(id));

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post retrieved successfully",
      data: post,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching post",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};


const getPostBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const post = await PostService.getPostBySlug(slug);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post retrieved successfully",
      data: post,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching post",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};


const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedPost = await PostService.updatePost(Number(id), updateData);

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating post",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Delete a post (owner only)
const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await PostService.deletePost(Number(id));

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting post",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Get featured posts (public)
const getFeaturedPosts = async (req: Request, res: Response) => {
  try {
    const { limit = 6 } = req.query;

    const posts = await PostService.getFeaturedPosts(Number(limit));

    return res.status(200).json({
      success: true,
      message: "Featured posts retrieved successfully",
      data: posts,
    });
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching featured posts",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Get recent posts (public)
const getRecentPosts = async (req: Request, res: Response) => {
  try {
    const { limit = 5 } = req.query;

    const posts = await PostService.getRecentPosts(Number(limit));

    return res.status(200).json({
      success: true,
      message: "Recent posts retrieved successfully",
      data: posts,
    });
  } catch (error) {
    console.error("Error fetching recent posts:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching recent posts",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Get blog statistics (owner only)
const getBlogStats = async (req: Request, res: Response) => {
  try {
    const stats = await PostService.getBlogStat();

    return res.status(200).json({
      success: true,
      message: "Blog statistics retrieved successfully",
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching blog stats:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching blog statistics",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const PostController = {
  createPost,
  getAllPosts,
  getPostById,
  getPostBySlug,
  updatePost,
  deletePost,
  getFeaturedPosts,
  getRecentPosts,
  getBlogStats,
};
