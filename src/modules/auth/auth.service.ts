import { prisma } from "../../config/db";
import { Prisma, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const loginWithEmailAndPassword = async ({
  email,
  password,
}: {
  email: string;
  password: string | null; // Allow password to be null
}) => {
  if (!password) {
    throw new Error("Password is required");
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // After null check, TypeScript now knows password is not null
  const passwordString: string = password; // Cast to string explicitly

  // Use bcrypt to compare the password, and ensure it's a valid string
  const isPasswordValid = await bcrypt.compare(passwordString, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return { token, user };
};

// Google authentication
const authWithGoogle = async (data: Prisma.UserCreateInput) => {
  let user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    // Create new user with the Google data
    user = await prisma.user.create({
      data,
    });
  }

  // Return user and optionally generate token if needed
  return user;
};

export const AuthService = {
  loginWithEmailAndPassword,
  authWithGoogle,
};
