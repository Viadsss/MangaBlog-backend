import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import * as postService from "../services/posts";
import * as userService from "../services/users";
import * as cloudinaryService from "../services/cloudinary";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { NotFoundError } from "../errors/NotFoundError";
import upload from "../middlewares/uploadMiddleware";

const validateCreatePost = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be between 5 and 100 characters long"),

  body("content").notEmpty().withMessage("Content is required"),
];

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

export const createPost = [
  upload.single("bannerImage"),
  ...validateCreatePost,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const bannerImage = req.file;
      const authorId = parseInt(req.params.authorId);
      const { title, content } = req.body;

      const user = await userService.getUserById(authorId);
      if (!user) throw new NotFoundError("User not found");

      if (user.role == "USER")
        throw new UnauthorizedError("The user is not admin or owner");

      const data = {
        title,
        content,
        authorId,
      };
      const newPost = await postService.createPost(data);

      if (bannerImage) {
        const bannerUrl = await cloudinaryService.uploadBannerImage(
          newPost.id,
          bannerImage
        );

        await postService.updateBannerUrl(newPost.id, bannerUrl);
      }

      res.status(201).json(newPost);
    } catch (err) {
      next(err);
    }
  },
];
