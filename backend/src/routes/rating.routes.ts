import { Router } from "express";
import { protectRoute } from "../middlewares/auth.js";
import {
    deleteRating,
    getStoreRatings,
    giveRating
} from "../controllers/rating.controller.js";

const router: Router = Router();

router.get('/:storeId', protectRoute, getStoreRatings);

router.post('/:storeId', protectRoute, giveRating);

router.delete('/:storeId', protectRoute, deleteRating);

export default router;