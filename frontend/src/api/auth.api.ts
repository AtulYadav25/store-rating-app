import type { UserRole } from "../constants/ROLES";
import { api, type APIResponse } from "./axios";

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    address?: string;
    role: UserRole;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    address: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthData {
    user: AuthUser;
}

export interface RegisterSuccessData {
    email: string;
    name: string;
}

export type AuthResponse = APIResponse<AuthData>;
export type RegisterResponse = APIResponse<RegisterSuccessData>;

export const register = async (data: RegisterData): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>("/auth/register", data);
    return response.data;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
};

export const getMe = async (): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>("/auth/me");
    return response.data;
};

export const logout = async (): Promise<APIResponse<Record<string, never>>> => {
    const response = await api.post<APIResponse<Record<string, never>>>("/auth/logout");
    return response.data;
};