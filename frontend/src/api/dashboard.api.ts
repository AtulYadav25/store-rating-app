import { api, type APIResponse, type PaginatedAPIResponse } from "./axios";
import type { UserRole } from "../constants/ROLES";

export interface AdminDashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

export interface DashboardUserStore {
  id: string;
  name: string;
  avgRating: number;
  ratingCount: number;
}

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  address: string;
  role: UserRole;
  createdAt: string;
  stores?: DashboardUserStore[];
}

export interface GetAdminUsersParams {
  page?: number;
  limit?: number;
  role?: UserRole;
  name?: string;
  email?: string;
  address?: string;
  sortBy?: "name" | "email" | "address" | "role" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export type AdminUsersResponse = PaginatedAPIResponse<DashboardUser>;

export const getAdminDashboardStats = async (): Promise<
  APIResponse<AdminDashboardStats>
> => {
  const response = await api.get<APIResponse<AdminDashboardStats>>(
    "/dashboard/admin"
  );
  return response.data;
};

export const getAdminUsers = async (
  params: GetAdminUsersParams = {}
): Promise<AdminUsersResponse> => {
  const { page = 1, limit = 10, role, name, email, address, sortBy, sortOrder } = params;
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(page));
  searchParams.set("limit", String(limit));
  if (role) searchParams.set("role", role);
  if (name?.trim()) searchParams.set("name", name.trim());
  if (email?.trim()) searchParams.set("email", email.trim());
  if (address?.trim()) searchParams.set("address", address.trim());
  if (sortBy) searchParams.set("sortBy", sortBy);
  if (sortOrder) searchParams.set("sortOrder", sortOrder);

  const response = await api.get<AdminUsersResponse>(
    `/dashboard/admin/users?${searchParams.toString()}`
  );
  return response.data;
};

export interface UpdateUserRoleData {
  userId: string;
  role: UserRole;
}

export const updateUserRole = async (
  data: UpdateUserRoleData
): Promise<APIResponse<DashboardUser>> => {
  const response = await api.patch<APIResponse<DashboardUser>>(
    "/user/update-role",
    data
  );
  return response.data;
};

// Store Owner Dashboard Types
export interface OwnerRatingUser {
  id: string;
  name: string;
  email: string;
  address: string;
}

export interface OwnerStoreInfo {
  id: string;
  name: string;
  email: string;
  address: string;
  image?: string | null;
  avgRating: number;
  ratingCount: number;
  createdAt: string;
}

export interface OwnerRatingItem {
  id: string;
  rating: number;
  createdAt: string;
  user: OwnerRatingUser;
  store: {
    id: string;
    name: string;
    address: string;
    avgRating: number;
    ratingCount: number;
  };
}

export interface OwnerStoreRatingsData {
  store: OwnerStoreInfo | null;
  ratings: OwnerRatingItem[];
}

export interface OwnerStoreRatingsResponse {
  success: boolean;
  message: string;
  data: OwnerStoreRatingsData;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface GetOwnerStoreRatingsParams {
  page?: number;
  limit?: number;
  sortBy?: "rating" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export const getOwnerStoreRatings = async (
  params: GetOwnerStoreRatingsParams = {}
): Promise<OwnerStoreRatingsResponse> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(page));
  searchParams.set("limit", String(limit));
  if (sortBy) searchParams.set("sortBy", sortBy);
  if (sortOrder) searchParams.set("sortOrder", sortOrder);

  const response = await api.get<OwnerStoreRatingsResponse>(
    `/dashboard/owner/ratings?${searchParams.toString()}`
  );
  return response.data;
};
