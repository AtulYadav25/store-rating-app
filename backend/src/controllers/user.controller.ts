import { prisma } from "../lib/prisma.js";
import { errorResponse, successResponse } from "../utils/responseHandler.js";
import type { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { validPassword } from "../validators/auth.types.js";

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