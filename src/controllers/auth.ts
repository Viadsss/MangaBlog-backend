import { NextFunction, Request, Response } from "express";
import * as userService from "../services/users";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import { ConflictError } from "../errors/ConflictError";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/UnauthorizedError";

const validateSignup = [
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

const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),

  body("password").notEmpty().withMessage("Password is required"),
];

export const signup = [
  ...validateSignup,
  async (req: Request, res: Response, next: NextFunction) => {
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

      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET!, {
        expiresIn: "1d",
      });

      res.status(201).json({ token });
    } catch (err) {
      next(err);
    }
  },
];

export const login = [
  ...validateLogin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await userService.getUserByemail(email);
      if (!user) throw new UnauthorizedError("Invalid Credentials");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new UnauthorizedError("Invalid Credentials");

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "1d",
      });
      res.json({ token });
    } catch (err) {
      next(err);
    }
  },
];
