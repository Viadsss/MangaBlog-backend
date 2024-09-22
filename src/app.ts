import express from "express";
import usersRoute from "./routes/users";

import errorHandler from "./middlewares/errorHandler";

const app = express();
app.use(express.json());

app.use("/api/users", usersRoute);

app.use(errorHandler);

export default app;
