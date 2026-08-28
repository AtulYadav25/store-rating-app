import { prisma } from "../lib/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";
import type { Request, Response } from "express";
import { errorResponse, paginationResponse, successResponse } from "../utils/responseHandler.js";

export const getStores = async (req: Request, res: Response) => {
    try {
        // Get query parameters
        const { page = 1, limit = 15, name, email, address } = req.query;

        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);

        if (
            Number.isNaN(pageNumber) ||
            Number.isNaN(limitNumber) ||
            pageNumber < 1 ||
            limitNumber < 1
        ) {
            return errorResponse(res, "Invalid query parameters", 400);
        }

        // Build search filters
        const conditions: Prisma.StoreWhereInput[] = [];

        // Apply All Filters
        if (typeof name === "string" && name.trim()) {
            conditions.push({
                name: {
                    contains: name.trim(),
                    mode: "insensitive",
                },
            });
        }

        // Search by email
        if (typeof email === "string" && email.trim()) {
            conditions.push({
                email: {
                    contains: email.trim(),
                    mode: "insensitive",
                },
            });
        }

        if (typeof address === "string" && address.trim()) {
            // Split address into individual search terms
            const addressTerms = address
                .trim()
                .split(/[,\s]+/)
                .filter(Boolean);

            // Every search term must exist somewhere in the address
            addressTerms.forEach((term) => {
                conditions.push({
                    address: {
                        contains: term,
                        mode: "insensitive",
                    },
                });
            });
        }

        const where: Prisma.StoreWhereInput = conditions.length > 0 ? { AND: conditions } : {};

        // Get stores
        const stores = await prisma.store.findMany({
            where,
            take: limitNumber,
            skip: (pageNumber - 1) * limitNumber,
            orderBy: {
                createdAt: "desc",
            },
        });

        paginationResponse(res, stores, pageNumber, limitNumber);

    } catch (error) {
        errorResponse(res, "Failed to fetch stores", 500, error);
    }
};

//Route to get a single store, and also get ratings of that store
export const getStore = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        if (!id) {
            return errorResponse(res, "Invalid store ID", 400);
        }

        //check if store exists
        const store = await prisma.store.findUnique({
            where: {
                id,
            },
            include: {
                ratings: {
                    take: 10,
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });

        if (!store) {
            return errorResponse(res, "Store not found", 404);
        }

        successResponse(res, store, 'Store fetched successfully', 200);

    } catch (error) {
        errorResponse(res, "Failed to fetch store", 500, error);
    }
};

//Route to add store (ADMIN ONLY)
export const addStore = async (req: Request, res: Response) => {
    try {
        const { name, email, address, image, ownerId } = req.body;

        if (!name || !email || !address) {
            return errorResponse(res, "Name, email, and address are required", 400);
        }

        // Validate field lengths according to project specifications
        if (name.trim().length < 20 || name.trim().length > 60) {
            return errorResponse(res, "Store name must be between 20 and 60 characters", 400);
        }

        if (address.trim().length > 400) {
            return errorResponse(res, "Address must not exceed 400 characters", 400);
        }

        // Check if store with this email already exists
        const storeExists = await prisma.store.findUnique({
            where: {
                email: email.trim().toLowerCase(),
            },
        });

        if (storeExists) {
            return errorResponse(res, "Store with this email already exists", 400);
        }

        // If ownerId is provided, verify that owner user exists
        if (ownerId) {
            const owner = await prisma.user.findUnique({
                where: { id: ownerId },
            });
            if (!owner) {
                return errorResponse(res, "Specified store owner does not exist", 404);
            }
        }

        const store = await prisma.store.create({
            data: {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                address: address.trim(),
                image: image || null,
                ownerId: ownerId || null,
            },
        });

        return successResponse(res, store, "Store added successfully", 201);

    } catch (error) {
        return errorResponse(res, "Failed to add store", 500, error);
    }
};
