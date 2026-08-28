import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.js";


const router: Router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protectRoute, logout);

export default router;