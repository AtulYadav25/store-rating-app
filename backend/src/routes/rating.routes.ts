import { Router } from "express";
import { protectRoute } from "../middlewares/auth.js";
import {
    deleteRating,
    getStoreRatings,
    giveRating,
    updateRating,
} from "../controllers/rating.controller.js";

const router: Router = Router();

router.get('/:storeId', protectRoute, getStoreRatings);

router.post('/:storeId', protectRoute, giveRating);

router.put('/:ratingId', protectRoute, updateRating);

router.delete('/:ratingId', protectRoute, deleteRating);

export default router;