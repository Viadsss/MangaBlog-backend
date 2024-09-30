import { Router } from "express";
import { isAuth, isAdmin } from "../middlewares/authMiddleware";
import * as controller from "../controllers/posts";

const router = Router();

router.get("/", controller.getAllPosts);

router.post("/:authorId", isAuth, isAdmin, controller.createPost);

router.put("/:id", isAuth, isAdmin, controller.updatePost);

export default router;
