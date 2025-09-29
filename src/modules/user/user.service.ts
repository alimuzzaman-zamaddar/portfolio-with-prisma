import { prisma } from "../../config/db";
import { Prisma, User } from "@prisma/client";

const createUser = async (payload: Prisma.UserCreateInput): Promise<User> => {
  const createdUser = await prisma.user.create({
    data: payload,
  });
  return createdUser;
};

const getAllFromDB = async () => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      picture: true,
      createdAt: true,
      updatedAt: true,
      role: true,
      status: true,
      posts: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const getUserById = async (id: number) => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      picture: true,
      createdAt: true,
      updatedAt: true,
      status: true,
      posts: true,
    },
  });
  return result;
};

const updateUser = async (
  id: number,
  payload: Partial<Prisma.UserUpdateInput>
) => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      picture: true,
      bio: true,
      location: true,
      website: true,
      github: true,
      linkedin: true,
      twitter: true,
      role: true,
      status: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

const deleteUser = async (id: number) => {
  const result = await prisma.user.delete({
    where: {
      id,
    },
  });
  return result;
};

export const UserService = {
  createUser,
  getAllFromDB,
  getUserById,
  updateUser,
  deleteUser,
};
