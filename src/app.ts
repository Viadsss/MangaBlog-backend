import express from "express";
import passport from "passport";
import usersRoute from "./routes/users";
import authRoute from "./routes/auth";
import errorHandler from "./middlewares/errorMiddleware";
import { jwtStrategy } from "./middlewares/authMiddleware";

const app = express();

app.use(express.json());
app.use(passport.initialize());

passport.use(jwtStrategy);

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);

app.use(errorHandler);

export default app;
