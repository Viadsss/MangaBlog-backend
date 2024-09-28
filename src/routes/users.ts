import { Router } from "express";
import { isAuth, isAdmin, isOwner } from "../middlewares/authMiddleware";
import * as controller from "../controllers/users";

const router = Router();

router.get("/", isAuth, isOwner, controller.getAllUsers);

router.put("/:id", isAuth, controller.updateUser);
router.put("/:id/password", isAuth, controller.updatePassword);
router.put("/:id/role/admin", isAuth, isOwner, controller.updateRoleToAdmin);

export default router;
