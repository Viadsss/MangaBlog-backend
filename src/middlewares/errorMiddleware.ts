import { Request, Response, NextFunction } from "express";
import { ConflictError } from "../errors/ConflictError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { ForbiddenError } from "../errors/ForbiddenError";

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

  if (
    err instanceof ConflictError ||
    err instanceof NotFoundError ||
    err instanceof UnauthorizedError ||
    err instanceof ForbiddenError
  ) {
    statusCode = err.statusCode;
    message = err.message;
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
