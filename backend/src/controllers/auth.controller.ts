import type { Response, Request } from "express";
import { loginSchema, signUpSchema, type PublicUser } from "../validators/auth.types.js";
import { prisma } from "../lib/prisma.js";
import { errorResponse, successResponse } from "../utils/responseHandler.js";
import bcrypt from 'bcrypt';
import { generateToken, durationToMs } from "../utils/jwt.js";
import { config } from "../config/env.js";
import { ROLES, type UserRole } from "../constants/ROLES.js";

export const register = async (req: Request, res: Response) => {
    try {
        //Validate inputs
        const { email, password, name, address } = signUpSchema.parse(req.body);

        //check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return errorResponse(res, "User already exists", 409);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        //ASSUMPTIONS: I assumed here we have the user which has authenticated email and it is verified
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                address,
                role: ROLES.USER
            }
        });

        successResponse<{ email: string; name: string }>(res, {
            email,
            name
        }, "User registered successfully", 201);

    } catch (error) {
        errorResponse(res, "Something went wrong", 500, error);
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        //Validate Body
        const { email, password } = loginSchema.parse(req.body);

        //Check if email exists
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return errorResponse(res, "Invalid credentials", 401);
        }

        //Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return errorResponse(res, "Invalid credentials", 401);
        }

        const publicUser: PublicUser = {
            id: String(user.id),
            name: user.name,
            email: user.email,
            address: user.address,
            role: user.role,
        };

        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role as UserRole,
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: config.NODE_ENV === "production" ? "none" : "lax",
            maxAge: durationToMs(config.JWT_EXPIRES_IN),
        });

        successResponse<{ user: PublicUser }>(res, { user: publicUser }, "Login successful", 200);

    } catch (error) {
        errorResponse(res, "Something went wrong", 500, error);
    }
}

export const getMe = async (req: Request, res: Response) => {
    try {
        const user = req.user;

        if (!user) {
            return errorResponse(res, 'User Not Authenticated', 401)
        }

        //fetch user from DB to get all details
        const userData = await prisma.user.findUnique({
            where: { id: user?.id },
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                role: true,
            },
        });

        if (!userData) {
            return errorResponse(res, "User not found", 404);
        }

        const publicUser: PublicUser = {
            id: String(userData.id),
            name: userData.name,
            email: userData.email,
            address: userData.address,
            role: userData.role,
        };
        successResponse<{ user: PublicUser }>(res, { user: publicUser }, "User fetched successfully", 200);
    } catch (error) {
        errorResponse(res, "Something went wrong", 500, error);
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: config.NODE_ENV === "production" ? "none" : "lax",
            expires: new Date(0),
        });
        successResponse(res, {}, "Logout successful", 200);
    } catch (error) {
        errorResponse(res, "Something went wrong", 500, error);
    }
}

