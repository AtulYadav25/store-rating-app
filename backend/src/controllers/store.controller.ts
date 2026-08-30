import { prisma } from "../lib/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";
import type { Request, Response } from "express";
import { errorResponse, paginationResponse, successResponse } from "../utils/responseHandler.js";
import { ROLES } from "../constants/ROLES.js";

export const getStores = async (req: Request, res: Response) => {
    try {
        // Get query parameters
        const { page = 1, limit = 15, search, sortBy = "createdAt", sortOrder = "desc" } = req.query;

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

        const allowedSortFields = ["name", "email", "address", "avgRating", "ratingCount", "createdAt"];
        const validSortBy = typeof sortBy === "string" && allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
        const validSortOrder = sortOrder === "asc" ? "asc" : "desc";

        const searchTerm = typeof search === "string" ? search.trim() : "";

        const where: Prisma.StoreWhereInput = searchTerm
            ? {
                OR: [
                    {
                        name: {
                            contains: searchTerm,
                            mode: "insensitive",
                        },
                    },
                    {
                        address: {
                            contains: searchTerm,
                            mode: "insensitive",
                        },
                    },
                ],
            }
            : {};

        const isAdmin = req.user?.role === ROLES.ADMIN;

        const stores = await prisma.store.findMany({
            where,
            ...(isAdmin && {
                include: {
                    owner: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            }),
            take: limitNumber,
            skip: (pageNumber - 1) * limitNumber,
            orderBy: {
                [validSortBy]: validSortOrder,
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
        const userId = req.user?.id;

        if (!id) {
            return errorResponse(res, "Invalid store ID", 400);
        }

        const store = await prisma.store.findUnique({
            where: {
                id,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        if (!store) {
            return errorResponse(res, "Store not found", 404);
        }

        let userRating: number | null = null;
        if (userId) {
            const ratingRecord = await prisma.rating.findUnique({
                where: {
                    userId_storeId: {
                        userId,
                        storeId: id,
                    },
                },
                select: { rating: true },
            });
            userRating = ratingRecord?.rating ?? null;
        }

        successResponse(res, { ...store, userRating }, 'Store fetched successfully', 200);

    } catch (error) {
        errorResponse(res, "Failed to fetch store", 500, error);
    }
};

//Route to add store (ADMIN ONLY)
export const addStore = async (req: Request, res: Response) => {
    try {
        const { name, email, address, image, ownerEmail } = req.body;

        if (!name || !email || !address) {
            return errorResponse(res, "Name, email, and address are required", 400);
        }

        if (name.trim().length < 20 || name.trim().length > 60) {
            return errorResponse(res, "Store name must be between 20 and 60 characters", 400);
        }

        if (address.trim().length > 400) {
            return errorResponse(res, "Address must not exceed 400 characters", 400);
        }

        const storeExists = await prisma.store.findUnique({
            where: {
                email: email.trim().toLowerCase(),
            },
        });

        if (storeExists) {
            return errorResponse(res, "Store with this email already exists", 400);
        }

        let resolvedOwnerId: string | null = null;
        const targetEmail = typeof ownerEmail === "string" && ownerEmail.trim() ? ownerEmail.trim().toLowerCase() : null;

        if (targetEmail) {
            const owner = await prisma.user.findUnique({
                where: { email: targetEmail },
            });
            if (!owner) {
                return errorResponse(res, "Specified store owner with this email does not exist", 404);
            }

            // Check if this owner is already assigned to a store
            const existingOwnerStore = await prisma.store.findFirst({
                where: { ownerId: owner.id },
            });
            if (existingOwnerStore) {
                return errorResponse(res, "This user is already assigned as an owner to another store", 400);
            }

            resolvedOwnerId = owner.id;
        }

        const store = await prisma.store.create({
            data: {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                address: address.trim(),
                image: image || null,
                ownerId: resolvedOwnerId,
            },
        });

        return successResponse(res, store, "Store added successfully", 201);

    } catch (error) {
        return errorResponse(res, "Failed to add store", 500, error);
    }
};

// Route to edit store (ADMIN ONLY)
export const editStore = async (req: Request, res: Response) => {
    try {
        const storeId = req.params.storeId as string;

        if (!storeId) {
            return errorResponse(res, "Store ID is required", 400);
        }

        const existingStore = await prisma.store.findUnique({
            where: { id: storeId },
        });

        if (!existingStore) {
            return errorResponse(res, "Store not found", 404);
        }

        const { name, email, address, image, ownerEmail } = req.body;

        if (name !== undefined) {
            if (name.trim().length < 20 || name.trim().length > 60) {
                return errorResponse(res, "Store name must be between 20 and 60 characters", 400);
            }
        }

        if (address !== undefined) {
            if (address.trim().length > 400) {
                return errorResponse(res, "Address must not exceed 400 characters", 400);
            }
        }

        if (email !== undefined && email.trim().toLowerCase() !== existingStore.email) {
            const emailTaken = await prisma.store.findUnique({
                where: { email: email.trim().toLowerCase() },
            });
            if (emailTaken) {
                return errorResponse(res, "Another store with this email already exists", 400);
            }
        }

        let resolvedOwnerId: string | null | undefined = undefined;

        if (ownerEmail !== undefined) {
            if (ownerEmail === null || ownerEmail.trim() === "") {
                resolvedOwnerId = null;
            } else {
                const targetEmail = ownerEmail.trim().toLowerCase();
                const owner = await prisma.user.findUnique({
                    where: { email: targetEmail },
                });
                if (!owner) {
                    return errorResponse(res, "Specified store owner with this email does not exist", 404);
                }

                // Check if this owner is already assigned to a DIFFERENT store
                const existingOwnerStore = await prisma.store.findFirst({
                    where: {
                        ownerId: owner.id,
                        NOT: { id: storeId },
                    },
                });
                if (existingOwnerStore) {
                    return errorResponse(res, "This user is already assigned as an owner to another store", 400);
                }

                resolvedOwnerId = owner.id;
            }
        }

        const updatedStore = await prisma.store.update({
            where: { id: storeId },
            data: {
                ...(name !== undefined && { name: name.trim() }),
                ...(email !== undefined && { email: email.trim().toLowerCase() }),
                ...(address !== undefined && { address: address.trim() }),
                ...(image !== undefined && { image: image ? image.trim() : null }),
                ...(resolvedOwnerId !== undefined && { ownerId: resolvedOwnerId }),
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return successResponse(res, updatedStore, "Store updated successfully", 200);

    } catch (error) {
        return errorResponse(res, "Failed to update store", 500, error);
    }
};

export const deleteStore = async (req: Request, res: Response) => {
    try {
        const storeId = req.params.storeId as string;

        if (!storeId) {
            return errorResponse(res, "Store ID is required", 400);
        }

        const existingStore = await prisma.store.findUnique({
            where: { id: storeId },
        });

        if (!existingStore) {
            return errorResponse(res, "Store not found", 404);
        }

        // Delete all ratings of the store and delete the store in a transaction
        await prisma.$transaction([
            prisma.rating.deleteMany({
                where: { storeId },
            }),
            prisma.store.delete({
                where: { id: storeId },
            }),
        ]);

        return successResponse(res, null, "Store and all associated ratings deleted successfully", 200);

    } catch (error) {
        return errorResponse(res, "Failed to delete store", 500, error);
    }
};