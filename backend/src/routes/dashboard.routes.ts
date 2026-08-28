import { Router } from "express";
import { hasRole, protectRoute } from "../middlewares/auth.js";
import { ROLES } from "../constants/ROLES.js";
import { adminDashboard, getUser, getUsers } from "../controllers/dashboard.controller.js";

const router: Router = Router();

router.get('/admin', protectRoute, hasRole(ROLES.ADMIN), adminDashboard);
router.get('/admin/users', protectRoute, hasRole(ROLES.ADMIN), getUsers);
router.get('/admin/users/:userId', protectRoute, hasRole(ROLES.ADMIN), getUser);

export default router;