import { Router } from "express";
import { getMe, login, logout, register } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.js";


const router: Router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectRoute, getMe);

export default router;