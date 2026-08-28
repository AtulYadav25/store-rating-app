import { errorResponse } from "../utils/responseHandler.js";
import { verifyToken } from "../utils/jwt.js";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;
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
        errorResponse(res, "Something went wrong", 500, error);
    }
}