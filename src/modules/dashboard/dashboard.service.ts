import { prisma } from "../../config/db";

const getDashboardStats = async () => {
  return await prisma.$transaction(async tx => {
    // Blog statistics
    const blogStats = await tx.post.aggregate({
      _count: true,
      _sum: { views: true },
      _avg: { views: true },
    });

    const publishedPosts = await tx.post.count({
      where: { isPublished: true },
    });

    const featuredPosts = await tx.post.count({
      where: { isFeatured: true, isPublished: true },
    });

    const draftPosts = await tx.post.count({
      where: { isPublished: false },
    });

    // Project statistics
    const projectStats = await tx.project.aggregate({
      _count: true,
    });

    const publishedProjects = await tx.project.count({
      where: { isPublished: true },
    });

    const featuredProjects = await tx.project.count({
      where: { isFeatured: true, isPublished: true },
    });

    const draftProjects = await tx.project.count({
      where: { isPublished: false },
    });

    // Recent activity
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const recentPosts = await tx.post.count({
      where: {
        createdAt: { gte: lastWeek },
      },
    });

    const recentProjects = await tx.project.count({
      where: {
        createdAt: { gte: lastWeek },
      },
    });

    // Most popular posts
    const topPosts = await tx.post.findMany({
      where: { isPublished: true },
      orderBy: { views: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        views: true,
        createdAt: true,
      },
    });

    // Recent posts and projects
    const latestPosts = await tx.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        isPublished: true,
        createdAt: true,
      },
    });

    const latestProjects = await tx.project.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        isPublished: true,
        createdAt: true,
      },
    });

    // Tag and tech stack analysis
    const allPosts = await tx.post.findMany({
      select: { tags: true },
    });

    const allProjects = await tx.project.findMany({
      select: { techStack: true },
    });

    const allTags = allPosts.flatMap(post => post.tags);
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const allTechStacks = allProjects.flatMap(project => project.techStack);
    const techStackCounts = allTechStacks.reduce((acc, tech) => {
      acc[tech] = (acc[tech] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      blog: {
        total: blogStats._count ?? 0,
        published: publishedPosts,
        featured: featuredPosts,
        drafts: draftPosts,
        totalViews: blogStats._sum.views ?? 0,
        avgViews: Math.round(blogStats._avg.views ?? 0),
        recentCount: recentPosts,
      },
      projects: {
        total: projectStats._count ?? 0,
        published: publishedProjects,
        featured: featuredProjects,
        drafts: draftProjects,
        recentCount: recentProjects,
      },
      analytics: {
        topPosts,
        latestPosts,
        latestProjects,
        popularTags: Object.entries(tagCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(([tag, count]) => ({ tag, count })),
        popularTechStacks: Object.entries(techStackCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(([tech, count]) => ({ tech, count })),
      },
      activity: {
        totalContent: (blogStats._count ?? 0) + (projectStats._count ?? 0),
        recentActivity: recentPosts + recentProjects,
        lastWeekActivity: {
          posts: recentPosts,
          projects: recentProjects,
        },
      },
    };
  });
};

const getContentOverview = async () => {
  return await prisma.$transaction(async tx => {
    // Get content counts by month for the last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyPosts = await tx.post.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: { gte: twelveMonthsAgo },
      },
      _count: true,
    });

    const monthlyProjects = await tx.project.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: { gte: twelveMonthsAgo },
      },
      _count: true,
    });

    // Get content by status
    const contentByStatus = {
      published: {
        posts: await tx.post.count({ where: { isPublished: true } }),
        projects: await tx.project.count({ where: { isPublished: true } }),
      },
      drafts: {
        posts: await tx.post.count({ where: { isPublished: false } }),
        projects: await tx.project.count({ where: { isPublished: false } }),
      },
      featured: {
        posts: await tx.post.count({
          where: { isFeatured: true, isPublished: true },
        }),
        projects: await tx.project.count({
          where: { isFeatured: true, isPublished: true },
        }),
      },
    };

    return {
      monthlyContent: {
        posts: monthlyPosts,
        projects: monthlyProjects,
      },
      contentByStatus,
    };
  });
};

export const DashboardService = {
  getDashboardStats,
  getContentOverview,
};
