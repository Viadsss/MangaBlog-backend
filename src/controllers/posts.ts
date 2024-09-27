import { NextFunction, Request, Response } from "express";
import * as postService from "../services/posts";
import * as userService from "../services/users";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { NotFoundError } from "../errors/NotFoundError";

export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await postService.getAllPosts();
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorId = parseInt(req.params.authorId);
    const { title, content, bannerUrl } = req.body;

    const user = await userService.getUserById(authorId);
    if (!user) throw new NotFoundError("User not found");

    if (user.role == "USER")
      throw new UnauthorizedError("The user is not admin or owner");

    const data = {
      title,
      content,
      bannerUrl,
      author: {
        connect: { id: authorId },
      },
    };
    const newPost = await postService.createPost(data);

    res.status(201).json(newPost);
  } catch (err) {
    next(err);
  }
};
