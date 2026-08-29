import { prisma } from "../lib/prisma.js";
import { errorResponse, successResponse } from "../utils/responseHandler.js";
import type { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { roleEnumSchema, signUpSchema, validPassword } from "../validators/auth.types.js";


export const addUser = async (req: Request, res: Response) => {
    try {
        const { name, email, address, password, role } = signUpSchema.parse(req.body);

        //Check if email already exists
        const isUserExist = await prisma.user.findUnique({
            where: { email },
            select: { email: true }
        });
        if (isUserExist) {
            return errorResponse(res, "User already exists", 409);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        //ASSUMPTIONS: Admin creates the user with specified role
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                address,
                role
            }
        });

        successResponse(res, { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role }, "User created successfully", 201);

    } catch (error) {
        errorResponse(res, "Failed to create user", 500, error);
    }
}

export const updatePassword = async (req: Request, res: Response) => {
    try {
        const { oldPassword, newPassword } = req.body;

        //validate passwords using zod
        const oldPassValidationResult = validPassword.safeParse(oldPassword);
        if (!oldPassValidationResult.success) {
            return errorResponse(res, "Invalid old password", 400, oldPassValidationResult.error);
        }

        const newPassValidationResult = validPassword.safeParse(newPassword);
        if (!newPassValidationResult.success) {
            return errorResponse(res, "Invalid new password", 400, newPassValidationResult.error);
        }

        if (oldPassword === newPassword) {
            return errorResponse(res, "New password must be different from old password", 400);
        }

        //Check if password is correct
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { password: true }
        });

        if (!user) {
            return errorResponse(res, "User not found", 404);
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return errorResponse(res, "Invalid old password", 401);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: req.user.id },
            data: { password: hashedPassword }
        });

        successResponse(res, {}, "Password updated successfully", 200);

    } catch (error) {
        errorResponse(res, "Error updating password", 500, error);
    }
}

export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const { role, userId } = req.body;

        if (!userId) {
            return errorResponse(res, "User ID is required", 400);
        }

        const roleValidationResult = roleEnumSchema.safeParse(role);
        if (!roleValidationResult.success) {
            return errorResponse(res, "Invalid role.", 400, roleValidationResult.error);
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, role: true }
        });

        if (!user) {
            return errorResponse(res, "User not found", 404);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role: roleValidationResult.data },
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                role: true,
                updatedAt: true
            }
        });

        successResponse(res, updatedUser, "User role updated successfully", 200);
    } catch (error) {
        errorResponse(res, "Failed to update user role", 500, error);
    }
};