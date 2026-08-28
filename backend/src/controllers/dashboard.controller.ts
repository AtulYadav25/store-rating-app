import type { Response, Request } from "express";
import { prisma } from "../lib/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";
import { errorResponse, paginationResponse, successResponse } from "../utils/responseHandler.js";
import { ROLES } from "../constants/ROLES.js";
import { z } from "zod";

const getUsersQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(20),
    role: z.enum([ROLES.USER, ROLES.ADMIN, ROLES.STORE_OWNER]).optional(),
    name: z.string().trim().optional(),
    email: z.string().trim().optional(),
    address: z.string().trim().optional(),
});

export const adminDashboard = async (req: Request, res: Response) => {
    try {
        const [totalUsers, totalStores, totalRatings] = await Promise.all([
            prisma.user.count(),
            prisma.store.count(),
            prisma.rating.count(),
        ]);

        return successResponse(res, {
            totalUsers,
            totalStores,
            totalRatings,
        }, "Dashboard stats fetched successfully", 200);

    } catch (error) {
        return errorResponse(res, "Failed to fetch dashboard stats", 500, error);
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const queryValidation = getUsersQuerySchema.safeParse(req.query);

        if (!queryValidation.success) {
            return errorResponse(res, "Invalid query parameters", 400, queryValidation.error.flatten());
        }

        const { page, limit, role, name, email, address } = queryValidation.data;

        const where: Prisma.UserWhereInput = {
            ...(role && { role }),
            ...(name && { name: { contains: name, mode: "insensitive" } }),
            ...(email && { email: { contains: email, mode: "insensitive" } }),
            ...(address && { address: { contains: address, mode: "insensitive" } }),
        };

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                role: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: limit,
            skip: (page - 1) * limit,
        });

        return paginationResponse(res, users, page, limit);

    } catch (error) {
        return errorResponse(res, "Failed to fetch users", 500, error);
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId as string;

        if (!userId) {
            return errorResponse(res, "User ID is required", 400);
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                ratings: {
                    select: {
                        id: true,
                        rating: true,
                        createdAt: true,
                        store: {
                            select: {
                                id: true,
                                name: true,
                                address: true,
                                avgRating: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
                stores: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        address: true,
                        avgRating: true,
                        ratingCount: true,
                    },
                },
            },
        });

        if (!user) {
            return errorResponse(res, "User not found", 404);
        }

        return successResponse(res, user, "User details fetched successfully", 200);

    } catch (error) {
        return errorResponse(res, "Failed to fetch user details", 500, error);
    }
};