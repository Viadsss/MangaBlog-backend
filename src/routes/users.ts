import { Router } from "express";
import {
  getAllUsers,
  updatePassword,
  updateRoleToAdmin,
  updateUsername,
} from "../controllers/users";
import { isAuth, isAdmin, isOwner } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", isAuth, isAdmin, getAllUsers);

router.put("/:id/role/admin", isAuth, isOwner, updateRoleToAdmin);
router.put("/username/:id", isAuth, updateUsername);
router.put("/password/:id", isAuth, updatePassword);

export default router;
