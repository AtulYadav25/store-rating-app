import { api, type APIResponse } from "./axios";

export interface AdminDashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

export const getAdminDashboardStats = async (): Promise<
  APIResponse<AdminDashboardStats>
> => {
  const response = await api.get<APIResponse<AdminDashboardStats>>(
    "/dashboard/admin"
  );
  return response.data;
};
