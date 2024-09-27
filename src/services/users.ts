import { Prisma } from "@prisma/client";
import prisma from "../clients/prismaClient";
import bcrypt from "bcryptjs";

export const getAllUsers = async () => {
  return await prisma.user.findMany();
};

export const getUserById = async (id: number) => {
  return await prisma.user.findUnique({ where: { id } });
};

export const getUserByemail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

export const createUser = async (data: Prisma.UserCreateInput) => {
  return await prisma.user.create({ data });
};

export const checkUsernameExists = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  return user !== null;
};

export const checkEmailExists = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user !== null;
};

export const updateProfileUrl = async (id: number, profileUrl: string) => {
  return await prisma.user.update({
    where: { id },
    data: { profileUrl },
  });
};

export const updateUsername = async (id: number, username: string) => {
  return await prisma.user.update({
    where: { id },
    data: { username },
  });
};

export const updatePassword = async (id: number, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });
};

export const updateRoleToAdmin = async (id: number) => {
  return await prisma.user.update({
    where: { id },
    data: { role: "ADMIN" },
  });
};
