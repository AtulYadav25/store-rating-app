import { updatePassword } from "../controllers/user.controller.js";
import { Router } from "express";
import { protectRoute } from "../middlewares/auth.js";

const router: Router = Router();

router.post("/update-password", protectRoute, updatePassword)

export default router;