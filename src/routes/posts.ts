import { Router } from "express";
import { isAuth } from "../middlewares/authMiddleware";
import * as controller from "../controllers/posts";

const router = Router();

router.get("/", controller.getAllPosts);

router.post("/:authorId", isAuth, controller.createPost);

export default router;
