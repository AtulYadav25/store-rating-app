import z from "zod";
import { ROLES } from "../constants/ROLES.js";

export const validPassword = z.string()
    .min(6, "Password must be at least 6 characters")
    .max(60, "Password is too long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character")

export const signUpSchema = z.object({
    name: z.string().min(3, "Name is too short").max(60, "Name is too long"),
    email: z.email("Invalid Email"),
    address: z.string().max(400),
    role: z.enum([ROLES.USER, ROLES.ADMIN, ROLES.STORE_OWNER]).optional(),
    password: validPassword,
});

export const loginSchema = z.object({
    email: z.email("Invalid Email"),
    password: validPassword,
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