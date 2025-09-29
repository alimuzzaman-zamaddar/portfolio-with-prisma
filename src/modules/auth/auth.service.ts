import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/db";
import { Prisma } from "@prisma/client";

// Service for user registration
const registerUser = async (data: Prisma.UserCreateInput) => {
  const { name, email, password } = data;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Ensure password is provided
  if (!password) {
    throw new Error("Password is required");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user in the database
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "USER", // Default role is USER
    },
  });

  return newUser;
};

// Service for logging in a user
const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      isVerified: true,
      password: true,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (!user.password) {
    throw new Error("Invalid credentials");
  }

  if (user.status === "INACTIVE" || user.status === "BLOCKED") {
    throw new Error("Account is inactive or blocked");
  }

  // Compare the password with the hashed password stored in the database
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  // Remove password from user object before returning
  const { password: _, ...userWithoutPassword } = user;

  return { token, user: userWithoutPassword };
};

// Service for verifying JWT token
const verifyToken = async (token: string) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      email: string;
      role: string;
    };

    // Check if user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        isVerified: true,
      },
    });

    if (!user || user.status !== "ACTIVE") {
      throw new Error("User not found or inactive");
    }

    return { user, payload };
  } catch (error) {
    throw new Error("Invalid token");
  }
};

// Service for getting current user profile
const getCurrentUser = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      picture: true,
      bio: true,
      location: true,
      website: true,
      github: true,
      linkedin: true,
      twitter: true,
      status: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const AuthService = {
  registerUser,
  loginUser,
  verifyToken,
  getCurrentUser,
};
