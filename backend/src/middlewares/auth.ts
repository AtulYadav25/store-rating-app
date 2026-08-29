import { errorResponse } from "../utils/responseHandler.js";
import { verifyToken } from "../utils/jwt.js";
import { prisma } from "../lib/prisma.js";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { UserRole } from "../constants/ROLES.js";

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token =
            req.cookies?.token ||
            (req.headers.authorization?.startsWith("Bearer ")
                ? req.headers.authorization.split(" ")[1]
                : null);

        if (!token) {
            return errorResponse(res, "Unauthorized", 401);
        }

        const decodedToken = verifyToken(token);
        if (!decodedToken) {
            return errorResponse(res, "Invalid token", 401);
        }

        req.user = decodedToken;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return errorResponse(res, "Token expired", 401);
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return errorResponse(res, "Invalid token", 401);
        }
        console.error("Auth middleware error:", error);
        errorResponse(res, "Something went wrong", 500, error);
    }
};

export const hasRole = (...allowedRoles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user?.id) {
                return errorResponse(res, "Unauthorized", 401);
            }

            const user = await prisma.user.findUnique({
                where: { id: req.user.id },
                select: { id: true, role: true },
            });

            if (!user) {
                return errorResponse(res, "User not found", 404);
            }

            const currentRole = user.role as UserRole;
            req.user.role = currentRole;

            if (!allowedRoles.includes(currentRole)) {
                return errorResponse(res, "Insufficient permissions", 403);
            }

            next();
        } catch (error) {
            console.error("Role authorization error:", error);
            return errorResponse(res, "Failed to verify user permissions", 500, error);
        }
    };
};