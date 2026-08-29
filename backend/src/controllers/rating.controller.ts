import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { errorResponse, paginationResponse, successResponse } from "../utils/responseHandler.js";
import { ROLES } from "../constants/ROLES.js";

const updateStoreRatingStats = async (storeId: string) => {
    const aggregate = await prisma.rating.aggregate({
        where: { storeId },
        _avg: { rating: true },
        _count: { rating: true },
    });

    const avgRating = aggregate._avg.rating ? parseFloat(aggregate._avg.rating.toFixed(2)) : 0;
    const ratingCount = aggregate._count.rating ?? 0;

    await prisma.store.update({
        where: { id: storeId },
        data: {
            avgRating,
            ratingCount,
        },
    });
};

export const getStoreRatings = async (req: Request, res: Response) => {
    try {
        const storeId = req.params.storeId as string;
        const { page = 1, limit = 10, userId } = req.query;

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

        const where: any = { storeId };

        if (typeof userId === "string" && userId.trim()) {
            where.userId = userId.trim();
        }

        const ratings = await prisma.rating.findMany({
            where,
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

        const storeExists = await prisma.store.findUnique({
            where: { id: storeId },
            select: { id: true },
        });

        if (!storeExists) {
            return errorResponse(res, "Store not found", 404);
        }

        // Upsert rating: create if new, update if already exists
        const userRating = await prisma.rating.upsert({
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
        });

        await updateStoreRatingStats(storeId);

        return successResponse(res, userRating, "Rating saved successfully", 200);

    } catch (error) {
        return errorResponse(res, "Failed to submit rating", 500, error);
    }
};

export const deleteRating = async (req: Request, res: Response) => {
    try {
        const ratingId = req.params.ratingId as string;
        const userId = req.user?.id;

        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }

        if (!ratingId) {
            return errorResponse(res, "Rating ID is required", 400);
        }

        const existingRating = await prisma.rating.findUnique({
            where: { id: ratingId },
        });

        if (!existingRating) {
            return errorResponse(res, "Rating not found", 404);
        }

        if (existingRating.userId !== userId && req.user?.role !== ROLES.ADMIN) {
            return errorResponse(res, "Forbidden: You can only delete your own rating", 403);
        }

        await prisma.rating.delete({
            where: { id: ratingId },
        });


        await updateStoreRatingStats(existingRating.storeId);

        return successResponse(res, null, "Rating deleted successfully", 200);

    } catch (error) {
        return errorResponse(res, "Failed to delete rating", 500, error);
    }
};
