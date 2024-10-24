import { NextFunction, Request, Response } from "express";
import * as userService from "../services/users";
import * as cloudinaryService from "../services/cloudinary";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import upload from "../middlewares/uploadMiddleware";
import { ConflictError } from "../errors/ConflictError";

const validateUserUpdate = [
  body("username")
    .optional()
    .trim()
    .isAlphanumeric()
    .withMessage("Username must contain only letters and numbers")
    .isLength({ min: 5, max: 20 })
    .withMessage("Username must be between 5 and 20 characters long"),
];

const validatePasswordUpdate = [
  body("oldPassword").notEmpty().withMessage("Old password is required"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const updateUser = [
  upload.single("profileImage"),
  ...validateUserUpdate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const id = parseInt(req.params.id);
      const { username } = req.body;
      const profileImage = req.file;
      const user = await userService.getUserById(id);
      if (!user) throw new NotFoundError("User not found");

      let updated = false;

      if (username && username !== user.username) {
        const usernameExists = await userService.checkUsernameExists(username);
        if (usernameExists) throw new ConflictError("Username already exists");
        await userService.updateUsername(id, username);
        updated = true;
      }

      if (profileImage) {
        const profileUrl = await cloudinaryService.uploadProfileImage(
          id,
          profileImage
        );
        await userService.updateProfileUrl(id, profileUrl);
        updated = true;
      }

      if (!updated) {
        return res.json({ message: "No changes made", updated: false });
      }

      res.json({ message: "User profile updated successfully", updated: true });
    } catch (err) {
      next(err);
    }
  },
];

export const updatePassword = [
  ...validatePasswordUpdate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const id = parseInt(req.params.id);
      const { oldPassword, newPassword } = req.body;

      const user = await userService.getUserById(id);
      if (!user) throw new NotFoundError("User not found");

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) throw new UnauthorizedError("Old password is incorrect");

      await userService.updatePassword(id, newPassword);
      res.json({ message: "Password updated successfully" });
    } catch (err) {
      next(err);
    }
  },
];

export const updateRoleToAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const user = await userService.getUserById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.role === "ADMIN") {
      return res.json({ message: "User is already an admin" });
    }

    await userService.updateRoleToAdmin(id);
    res.json({
      message: "User role updated successfully",
    });
  } catch (err) {
    next(err);
  }
};
