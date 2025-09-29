import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_OWNER_EMAIL || "admin@portfolio.com";
  const pass = process.env.SEED_OWNER_PASSWORD || "admin123";
  const name = process.env.SEED_OWNER_NAME || "Portfolio Owner";

  const hashed = await bcrypt.hash(pass, 10);

  const owner = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashed,
      role: "OWNER",
      name,
      bio: "Portfolio owner and developer",
      location: "Your Location",
      website: "https://yourwebsite.com",
      github: "https://github.com/yourusername",
      linkedin: "https://linkedin.com/in/yourusername",
      isVerified: true,
    },
  });

  // Create some sample projects
  const sampleProjects = [
    {
      title: "Portfolio Website",
      slug: "portfolio-website",
      description:
        "A modern portfolio website built with Next.js and TypeScript",
      content:
        "This is a comprehensive portfolio website showcasing my projects and skills.",
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma"],
      liveUrl: "https://yourportfolio.com",
      githubUrl: "https://github.com/yourusername/portfolio",
      isFeatured: true,
      order: 1,
      authorId: owner.id,
    },
    {
      title: "E-commerce Platform",
      slug: "ecommerce-platform",
      description: "Full-stack e-commerce solution with payment integration",
      content:
        "A complete e-commerce platform with user authentication, product management, and payment processing.",
      techStack: ["React", "Node.js", "Express", "MongoDB", "Stripe"],
      liveUrl: "https://yourstore.com",
      githubUrl: "https://github.com/yourusername/ecommerce",
      isFeatured: true,
      order: 2,
      authorId: owner.id,
    },
  ];

  for (const project of sampleProjects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: project,
    });
  }

  // Create some sample blog posts
  const samplePosts = [
    {
      title: "Welcome to My Portfolio",
      slug: "welcome-to-my-portfolio",
      content:
        "Welcome to my portfolio! Here you'll find information about my projects, skills, and experience.",
      excerpt:
        "An introduction to my portfolio website and what you can expect to find here.",
      tags: ["portfolio", "introduction", "web-development"],
      isFeatured: true,
      authorId: owner.id,
    },
    {
      title: "Building Modern Web Applications",
      slug: "building-modern-web-applications",
      content:
        "Learn about the latest technologies and best practices for building modern web applications.",
      excerpt:
        "A comprehensive guide to modern web development technologies and methodologies.",
      tags: ["web-development", "javascript", "react", "best-practices"],
      isFeatured: false,
      authorId: owner.id,
    },
  ];

  for (const post of samplePosts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  console.log("✅ Seeded owner:", email);
  console.log("✅ Created sample projects and blog posts");
}
main().finally(() => prisma.$disconnect());
