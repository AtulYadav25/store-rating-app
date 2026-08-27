import type { Response, Request } from "express";
import { signUpSchema } from "../validators/auth.types.js";
import { prisma } from "../lib/prisma.js";
import { ROLES } from "../constants/ROLES.js";
import { errorResponse, successResponse } from "../utils/responseHandler.js";
import bcrypt from 'bcrypt';

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

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                address,
                role: ROLES.USER
            }
        })

        successResponse<{ email: String, name: String }>(res, {
            email,
            name
        }, "User registered successfully", 201);


    } catch (error) {

    }
}

export const login = async (req: Request, res: Response) => {
    try {


    } catch (error) {

    }
}
