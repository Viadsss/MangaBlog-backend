import { Prisma } from "@prisma/client";
import prisma from "../clients/prismaClient";

export const getAllPosts = async () => {
  return await prisma.post.findMany({
    include: {
      author: {
        select: {
          username: true,
          profileUrl: true,
        },
      },
    },
  });
};

export const createPost = async (data: Prisma.PostCreateInput) => {
  return await prisma.post.create({ data });
};
