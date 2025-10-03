import { Request, Response } from "express";
import { ProjectService } from "./project.service";

const createProject = async (req: Request, res: Response) => {
  const {
    title,
    slug,
    description,
    content,
    thumbnail,
    liveUrl,
    githubUrl,
    techStack,
    isFeatured,
    order,
  } = req.body;

  if (!title || !slug || !description) {
    return res.status(400).json({
      success: false,
      message: "Title, slug, and description are required",
    });
  }

  try {
    const project = await ProjectService.createProject({
      title,
      slug,
      description,
      content,
      thumbnail,
      liveUrl,
      githubUrl,
      techStack: techStack || [],
      isFeatured: isFeatured || false,
      order: order || 0,
      author: {
        connect: { id: req.user?.id },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating project",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

const getAllProjects = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      isFeatured,
      techStack,
      isPublished = "true",
    } = req.query;

    const result = await ProjectService.getAllProjects({
      page: Number(page),
      limit: Number(limit),
      search: search as string,
      isFeatured:
        isFeatured === "true"
          ? true
          : isFeatured === "false"
          ? false
          : undefined,
      techStack: techStack
        ? Array.isArray(techStack)
          ? (techStack as string[])
          : [techStack as string]
        : undefined,
      isPublished: isPublished === "true",
    });

    return res.status(200).json({
      success: true,
      message: "Projects retrieved successfully",
      ...result,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching projects",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

const getProjectById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const project = await ProjectService.getProjectById(Number(id));

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project retrieved successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching project",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

const getProjectBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const project = await ProjectService.getProjectBySlug(slug);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project retrieved successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching project",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedProject = await ProjectService.updateProject(
      Number(id),
      updateData
    );

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating project",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await ProjectService.deleteProject(Number(id));

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting project",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
const getFeaturedProjects = async (req: Request, res: Response) => {
  try {
    const { limit = 6 } = req.query;

    const projects = await ProjectService.getFeaturedProjects(Number(limit));

    return res.status(200).json({
      success: true,
      message: "Featured projects retrieved successfully",
      data: projects,
    });
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching featured projects",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

const getProjectStats = async (req: Request, res: Response) => {
  try {
    const stats = await ProjectService.getProjectStats();

    return res.status(200).json({
      success: true,
      message: "Project statistics retrieved successfully",
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching project stats:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching project statistics",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const ProjectController = {
  createProject,
  getAllProjects,
  getProjectById,
  getProjectBySlug,
  updateProject,
  deleteProject,
  getFeaturedProjects,
  getProjectStats,
};
