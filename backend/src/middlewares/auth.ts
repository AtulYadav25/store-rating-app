import { errorResponse } from "../utils/responseHandler.js";
import { verifyToken } from "../utils/jwt.js";
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
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !req.user.role) {
            return errorResponse(res, "Unauthorized", 401);
        }

        if (!allowedRoles.includes(req.user.role)) {
            return errorResponse(res, "Insufficient permissions", 403);
        }

        next();
    };
};