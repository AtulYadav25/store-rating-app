import { useQuery } from "@tanstack/react-query";
import { getAdminDashboardStats } from "../api/dashboard.api";

export const DASHBOARD_QUERY_KEY = ["dashboard"] as const;

export const useAdminDashboardStats = () => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "admin"],
    queryFn: getAdminDashboardStats,
    staleTime: 1000 * 30,
  });
};
