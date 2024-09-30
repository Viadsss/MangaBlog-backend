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

const validateUpdatePost = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be between 5 and 100 characters long"),

  body("content").optional(),
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

export const updatePost = [
  upload.single("bannerImage"),
  ...validateUpdatePost,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const bannerImage = req.file;
      const id = parseInt(req.params.id);
      const { title, content } = req.body;

      const post = await postService.getPostById(id);
      if (!post) throw new NotFoundError("Post not found");

      let updated = false;
      const updatedData: { title?: string; content?: string } = {};

      if (title && title !== post.title) {
        updatedData.title = title;
        updated = true;
      }

      if (content && content !== post.content) {
        updatedData.content = content;
        updated = true;
      }

      if (bannerImage) {
        const bannerUrl = await cloudinaryService.uploadBannerImage(
          id,
          bannerImage
        );
        await postService.updateBannerUrl(id, bannerUrl);
        updated = true;
      }

      if (!updated) {
        return res.json({ message: "No changes made", updated: false });
      }

      await postService.updatePost(id, updatedData);
      res.json({ message: "Post updated successfully", updated: true });
    } catch (err) {
      next(err);
    }
  },
];
