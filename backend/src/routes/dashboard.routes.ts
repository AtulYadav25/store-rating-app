import { Router } from "express";
import { hasRole, protectRoute } from "../middlewares/auth.js";
import { ROLES } from "../constants/ROLES.js";
import {
    adminDashboard,
    getUser,
    getUsers,
    getUsersWithRatings,
} from "../controllers/dashboard.controller.js";

const router: Router = Router();

// Admin Routes
router.get('/admin', protectRoute, hasRole(ROLES.ADMIN), adminDashboard);
router.get('/admin/users', protectRoute, hasRole(ROLES.ADMIN), getUsers);
router.get('/admin/users/:userId', protectRoute, hasRole(ROLES.ADMIN), getUser);

// Store Owner Routes
router.get('/owner/ratings', protectRoute, hasRole(ROLES.STORE_OWNER), getUsersWithRatings);

export default router;