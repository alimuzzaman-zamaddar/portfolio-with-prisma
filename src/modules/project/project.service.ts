import { Project, Prisma } from "@prisma/client";
import { prisma } from "../../config/db";

const createProject = async (
  payload: Prisma.ProjectCreateInput
): Promise<Project> => {
  const result = await prisma.project.create({
    data: payload,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return result;
};

const getAllProjects = async ({
  page = 1,
  limit = 10,
  search,
  isFeatured,
  techStack,
  isPublished = true,
}: {
  page?: number;
  limit?: number;
  search?: string;
  isFeatured?: boolean;
  techStack?: string[];
  isPublished?: boolean;
}) => {
  const skip = (page - 1) * limit;

  const where: any = {
    isPublished,
    AND: [
      search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      },
      typeof isFeatured === "boolean" && { isFeatured },
      techStack &&
        techStack.length > 0 && { techStack: { hasEvery: techStack } },
    ].filter(Boolean),
  };

  const result = await prisma.project.findMany({
    skip,
    take: limit,
    where,
    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  const total = await prisma.project.count({ where });

  return {
    data: result,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getProjectById = async (id: number) => {
  return await prisma.project.findUnique({
    where: { id },
    include: { author: true },
  });
};

const getProjectBySlug = async (slug: string) => {
  return await prisma.project.findUnique({
    where: { slug },
    include: { author: true },
  });
};

const updateProject = async (
  id: number,
  data: Partial<Prisma.ProjectUpdateInput>
) => {
  return prisma.project.update({
    where: { id },
    data,
    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

const deleteProject = async (id: number) => {
  return prisma.project.delete({ where: { id } });
};

const getFeaturedProjects = async (limit: number = 6) => {
  return await prisma.project.findMany({
    where: {
      isFeatured: true,
      isPublished: true,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take: limit,
  });
};

const getProjectStats = async () => {
  return await prisma.$transaction(async tx => {
    const aggregates = await tx.project.aggregate({
      _count: true,
    });

    const featuredCount = await tx.project.count({
      where: {
        isFeatured: true,
        isPublished: true,
      },
    });

    const publishedCount = await tx.project.count({
      where: {
        isPublished: true,
      },
    });

    const techStackCount = await tx.project.findMany({
      select: {
        techStack: true,
      },
    });

    const allTechStacks = techStackCount.flatMap(project => project.techStack);
    const uniqueTechStacks = [...new Set(allTechStacks)];

    return {
      totalProjects: aggregates._count ?? 0,
      publishedProjects: publishedCount,
      featuredProjects: featuredCount,
      uniqueTechStacks: uniqueTechStacks.length,
      allTechStacks: uniqueTechStacks,
    };
  });
};

export const ProjectService = {
  createProject,
  getAllProjects,
  getProjectById,
  getProjectBySlug,
  updateProject,
  deleteProject,
  getFeaturedProjects,
  getProjectStats,
};
