import z from "zod";
import { ROLES } from "../constants/ROLES.js";

export const validPassword = z.string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must be at most 16 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character");

export const roleEnumSchema = z.enum([ROLES.USER, ROLES.ADMIN, ROLES.STORE_OWNER]);

export const signUpSchema = z.object({
    name: z.string().min(3, "Name is too short").max(60, "Name is too long"),
    email: z.string().email("Invalid Email"),
    address: z.string().max(400, "Address is too long"),
    role: roleEnumSchema.optional().default(ROLES.USER),
    password: validPassword,
});

export const loginSchema = z.object({
    email: z.email("Invalid Email"),
    password: z.string(),
});

export const publicUserSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.email("Invalid Email"),
    address: z.string(),
    role: z.string(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PublicUser = z.infer<typeof publicUserSchema>;

export const updateRoleSchema = z.object({
    userId: z.string().optional(),
    role: roleEnumSchema,
});

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;