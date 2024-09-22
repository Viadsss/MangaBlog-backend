export class UnauthorizedError extends Error {
  public readonly name: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = 401;
    this.isOperational = true;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}
