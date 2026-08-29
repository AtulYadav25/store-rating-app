import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export interface APIErrorItem {
    field?: string | number;
    message: string;
}

export interface APIResponse<T = unknown> {
    success: boolean;
    message: string;
    data: T;
    error?: APIErrorItem[] | Record<string, unknown> | string | null;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    total?: number;
}

export interface PaginatedAPIResponse<T = unknown> {
    success: boolean;
    message: string;
    data: T[];
    meta: PaginationMeta;
    error?: APIErrorItem[] | Record<string, unknown> | string | null;
}