import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { errorResponse, paginationResponse, successResponse } from "../utils/responseHandler.js";

export const getStoreRatings = async (req: Request, res: Response) => {
    try {
        const storeId = req.params.storeId as string;
        const { page = 1, limit = 10 } = req.query;

        if (!storeId) {
            return errorResponse(res, "Store ID is required", 400);
        }

        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);

        if (Number.isNaN(pageNumber) || Number.isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
            return errorResponse(res, "Invalid pagination parameters", 400);
        }

        const storeExists = await prisma.store.findUnique({
            where: { id: storeId },
            select: { id: true },
        });

        if (!storeExists) {
            return errorResponse(res, "Store not found", 404);
        }

        const ratings = await prisma.rating.findMany({
            where: { storeId },
            take: limitNumber,
            skip: (pageNumber - 1) * limitNumber,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return paginationResponse(res, ratings, pageNumber, limitNumber);

    } catch (error) {
        return errorResponse(res, "Failed to fetch store ratings", 500, error);
    }
};

export const giveRating = async (req: Request, res: Response) => {
    try {
        const storeId = req.params.storeId as string;
        const { rating } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }

        if (!storeId) {
            return errorResponse(res, "Store ID is required", 400);
        }

        const numericRating = Number(rating);

        if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
            return errorResponse(res, "Rating must be an integer between 1 and 5", 400);
        }

        // Fetch store current rating stats
        const store = await prisma.store.findUnique({
            where: { id: storeId },
            select: { id: true, avgRating: true, ratingCount: true },
        });

        if (!store) {
            return errorResponse(res, "Store not found", 404);
        }

        // Check if user already submitted a rating for this store
        const existingRating = await prisma.rating.findUnique({
            where: {
                userId_storeId: {
                    userId,
                    storeId,
                },
            },
            select: { rating: true },
        });

        let newRatingCount: number;
        let newAvgRating: number;

        if (existingRating) {
            // Updating existing rating: count stays same, replace old rating with new
            const oldRating = existingRating.rating;
            newRatingCount = store.ratingCount || 1;
            const currentTotalSum = store.avgRating * store.ratingCount;
            const newTotalSum = currentTotalSum - oldRating + numericRating;
            newAvgRating = parseFloat((newTotalSum / newRatingCount).toFixed(2));
        } else {
            // Adding a new rating: increment count and add new rating to sum
            newRatingCount = store.ratingCount + 1;
            const currentTotalSum = store.avgRating * store.ratingCount;
            const newTotalSum = currentTotalSum + numericRating;
            newAvgRating = parseFloat((newTotalSum / newRatingCount).toFixed(2));
        }

        // Execute rating upsert and store stats update atomically in a transaction
        const [userRating] = await prisma.$transaction([
            prisma.rating.upsert({
                where: {
                    userId_storeId: {
                        userId,
                        storeId,
                    },
                },
                update: {
                    rating: numericRating,
                },
                create: {
                    userId,
                    storeId,
                    rating: numericRating,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            }),
            prisma.store.update({
                where: { id: storeId },
                data: {
                    avgRating: newAvgRating,
                    ratingCount: newRatingCount,
                },
            }),
        ]);

        return successResponse(res, userRating, "Rating saved successfully", 200);

    } catch (error) {
        return errorResponse(res, "Failed to submit rating", 500, error);
    }
};

export const deleteRating = async (req: Request, res: Response) => {
    try {
        const storeId = req.params.storeId as string;
        const userId = req.user?.id;

        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }

        if (!storeId) {
            return errorResponse(res, "Store ID is required", 400);
        }

        const existingRating = await prisma.rating.findUnique({
            where: {
                userId_storeId: {
                    userId,
                    storeId,
                },
            },
            include: {
                store: {
                    select: { id: true, avgRating: true, ratingCount: true },
                },
            },
        });

        if (!existingRating) {
            return errorResponse(res, "Rating not found", 404);
        }

        const store = existingRating.store;
        const newRatingCount = Math.max(0, (store?.ratingCount ?? 1) - 1);
        let newAvgRating = 0;

        if (newRatingCount > 0 && store) {
            const currentTotalSum = store.avgRating * store.ratingCount;
            const newTotalSum = Math.max(0, currentTotalSum - existingRating.rating);
            newAvgRating = parseFloat((newTotalSum / newRatingCount).toFixed(2));
        }

        // Atomically delete rating and update store stats
        await prisma.$transaction([
            prisma.rating.delete({
                where: {
                    userId_storeId: {
                        userId,
                        storeId,
                    },
                },
            }),
            prisma.store.update({
                where: { id: storeId },
                data: {
                    avgRating: newAvgRating,
                    ratingCount: newRatingCount,
                },
            }),
        ]);

        return successResponse(res, null, "Rating deleted successfully", 200);

    } catch (error) {
        return errorResponse(res, "Failed to delete rating", 500, error);
    }
};
