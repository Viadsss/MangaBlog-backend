import express from "express";
import passport from "passport";
import errorHandler from "./middlewares/errorMiddleware";
import { jwtStrategy } from "./middlewares/authMiddleware";
import authRoute from "./routes/auth";
import usersRoute from "./routes/users";
import postsRoute from "./routes/posts";

const app = express();

app.use(express.json());
app.use(passport.initialize());

passport.use(jwtStrategy);

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/posts", postsRoute);

app.use(errorHandler);

export default app;
