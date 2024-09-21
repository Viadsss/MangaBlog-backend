import express, { Request, Response, NextFunction } from "express";
import userRoute from "./routes/user";

import { AppError } from "./errors/AppError";
import errorHandler from "./middlewares/errorHandler";

const app = express();

app.use("/api/users", userRoute);

app.get("/", (req, res) => {
  throw new AppError("App Something broke!");
});

app.use(errorHandler);

export default app;
