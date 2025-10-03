import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // OWNER credentials from env or defaults
  const ownerEmail = process.env.SEED_OWNER_EMAIL || "owner@portfolio.com";
  const ownerPass = process.env.SEED_OWNER_PASSWORD || "owner123";
  const ownerName = process.env.SEED_OWNER_NAME || "Portfolio Owner";


  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@portfolio.com";
  const adminPass = process.env.SEED_ADMIN_PASSWORD || "admin123";
  const adminName = process.env.SEED_ADMIN_NAME || "Portfolio Admin";


  const ownerHashed = await bcrypt.hash(ownerPass, 10);
  const adminHashed = await bcrypt.hash(adminPass, 10);


  const owner = await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {},
    create: {
      email: ownerEmail,
      password: ownerHashed,
      name: ownerName,
      role: "OWNER",
      bio: "Portfolio owner and developer",
      location: "Your Location",
      website: "https://yourwebsite.com",
      github: "https://github.com/yourusername",
      linkedin: "https://linkedin.com/in/yourusername",
      isVerified: true,
    },
  });

  console.log(`✅ Seeded OWNER: ${owner.email}`);


  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: adminHashed,
      name: adminName,
      role: "ADMIN",
      isVerified: true,
    },
  });

  console.log(`✅ Seeded ADMIN: ${admin.email}`);


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
        "A complete e-commerce platform with authentication, product management, and payments.",
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
  console.log(" Seeded sample projects");


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

  console.log(" Seeded sample blog posts");
}

main()
  .catch((err) => {
    console.error(" Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log(" Seeding finished.");
  });
