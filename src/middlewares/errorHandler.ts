import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let name = err.name;
  let message = err.message;
  let isOperational = false;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    isOperational = err.isOperational;
  }

  console.error(err);

  res.status(statusCode).json({
    name,
    statusCode,
    isOperational,
    message,
  });
};

export default errorHandler;
