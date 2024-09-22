import { NextFunction, Request, Response } from "express";
import * as userService from "../services/users";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import {
  CreateUserBody,
  UpdatePasswordBody,
  UpdatePasswordParams,
  UpdateUsernameBody,
  UpdateUsernameParams,
} from "../types/users";
import { ConflictError } from "../errors/ConflictError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";

const validateUser = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isAlphanumeric()
    .withMessage("Username must contain only letters and numbers")
    .isLength({ min: 5, max: 20 })
    .withMessage("Username must be between 5 and 20 characters long"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

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

export const createUser = [
  ...validateUser,
  async (
    req: Request<{}, {}, CreateUserBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, email, password } = req.body;

      const userNameExists = await userService.checkUsernameExists(username);
      if (userNameExists) {
        throw new ConflictError("Username already exists");
      }

      const userEmailExists = await userService.checkEmailExists(email);
      if (userEmailExists) {
        throw new ConflictError("Email already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const data = { username, email, password: hashedPassword };
      const newUser = await userService.createUser(data);

      res.status(201).json(newUser);
    } catch (err) {
      next(err);
    }
  },
];

export const updateUsername = [
  ...validateUsernameUpdate,
  async (
    req: Request<UpdateUsernameParams, {}, UpdateUsernameBody>,
    res: Response,
    next: NextFunction
  ) => {
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
  async (
    req: Request<UpdatePasswordParams, {}, UpdatePasswordBody>,
    res: Response,
    next: NextFunction
  ) => {
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
