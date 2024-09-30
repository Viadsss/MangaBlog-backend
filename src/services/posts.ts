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

export const getPostById = async (id: number) => {
  return await prisma.post.findUnique({ where: { id } });
};

export const createPost = async (data: {
  title: string;
  content: string;
  authorId: number;
}) => {
  const { authorId, ...postData } = data;

  return await prisma.post.create({
    data: {
      ...postData,
      author: {
        connect: { id: authorId },
      },
    },
  });
};

export const updatePost = async (
  id: number,
  data: { title?: string; content?: string }
) => {
  return await prisma.post.update({
    where: { id },
    data: { ...data },
  });
};

export const updateBannerUrl = async (id: number, bannerUrl: string) => {
  return await prisma.post.update({
    where: { id },
    data: { bannerUrl },
  });
};
