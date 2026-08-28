import type { Response, Request } from "express";
import { loginSchema, signUpSchema, type PublicUser } from "../validators/auth.types.js";
import { prisma } from "../lib/prisma.js";
import { ROLES } from "../constants/ROLES.js";
import { errorResponse, successResponse } from "../utils/responseHandler.js";
import bcrypt from 'bcrypt';
import { generateToken } from "../utils/jwt.js";

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

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                address,
                role: ROLES.USER
            }
        })

        const token = generateToken({
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
        });

        successResponse<{ email: String, name: String }>(res, {
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
            role: user.role,
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
        });

        successResponse<PublicUser>(res, publicUser, "Login successful", 200);

    } catch (error) {
        errorResponse(res, "Something went wrong", 500, error);
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            secure: true,
            expires: new Date(0),
        });
        successResponse(res, {}, "Logout successful", 200);
    } catch (error) {
        errorResponse(res, "Something went wrong", 500, error);
    }
}
