import { NextFunction, Request, Response } from "express";
import * as userService from "../services/users";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";

const validateUsernameUpdate = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
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

export const updateUsername = [
  ...validateUsernameUpdate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const id = parseInt(req.params.id);
      const username = req.body.username;

      const updatedUser = await userService.updateUsername(id, username);
      res.json(updatedUser);
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
      return res.json({ message: "User is already an admin.", user });
    }

    const updatedUser = await userService.updateRoleToAdmin(id);
    res.json({ message: "User role updated successfully", user: updatedUser });
  } catch (err) {
    next(err);
  }
};
