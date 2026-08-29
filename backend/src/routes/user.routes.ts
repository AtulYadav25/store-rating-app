import { addUser, updatePassword } from "../controllers/user.controller.js";
import { Router } from "express";
import { protectRoute, hasRole } from "../middlewares/auth.js";
import { ROLES } from "../constants/ROLES.js";

const router: Router = Router();

// Admin Routes
router.post("/add-user", protectRoute, hasRole(ROLES.ADMIN), addUser);

router.post("/update-password", protectRoute, updatePassword);

export default router;