import { Router } from "express";
import { protectRoute, hasRole } from "../middlewares/auth.js";
import { ROLES } from "../constants/ROLES.js";
import { addStore, deleteStore, editStore, getStore, getStores } from "../controllers/store.controller.js";

const router: Router = Router();

router.get('/', protectRoute, getStores);
router.get('/:id', protectRoute, getStore);
router.post('/', protectRoute, hasRole(ROLES.ADMIN), addStore);
router.put('/:storeId', protectRoute, hasRole(ROLES.ADMIN), editStore);
router.delete('/:storeId', protectRoute, hasRole(ROLES.ADMIN), deleteStore);

export default router;