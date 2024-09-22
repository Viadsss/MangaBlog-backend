import { Router } from "express";
import * as controller from "../controllers/users";

const router = Router();

router.get("/", controller.getAllUsers);
router.get("/:id");

router.post("/", controller.createUser);

router.put("/username/:id", controller.updateUsername);
router.put("/password/:id", controller.updatePassword);

export default router;
