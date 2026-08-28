import { Router } from "express";
import { protectRoute, hasRole } from "../middlewares/auth.js";
import { ROLES } from "../constants/ROLES.js";
import { addStore, getMyStores, getStore, getStores } from "../controllers/store.controller.js";

const router: Router = Router();

router.get('/', protectRoute, getStores);
router.get('/my-stores', protectRoute, hasRole(ROLES.STORE_OWNER), getMyStores);
router.get('/:id', protectRoute, getStore);
router.post('/', protectRoute, hasRole(ROLES.ADMIN), addStore);

export default router;