import { Router } from "express";
import { isAuth, isAdmin, isOwner } from "../middlewares/authMiddleware";
import * as controller from "../controllers/users";

const router = Router();

router.get("/", controller.getAllUsers);

router.put("/:id/role/admin", isAuth, isOwner, controller.updateRoleToAdmin);
router.put("/username/:id", isAuth, controller.updateUsername);
router.put("/password/:id", isAuth, controller.updatePassword);

export default router;
