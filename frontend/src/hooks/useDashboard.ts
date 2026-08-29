import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  getAdminDashboardStats,
  getAdminUsers,
  updateUserRole,
  type GetAdminUsersParams,
  type UpdateUserRoleData,
} from "../api/dashboard.api";

export const DASHBOARD_QUERY_KEY = ["dashboard"] as const;

export const useAdminDashboardStats = () => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "admin", "stats"],
    queryFn: getAdminDashboardStats,
    staleTime: 1000 * 30,
  });
};

export const useAdminUsers = (params: GetAdminUsersParams = {}) => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "admin", "users", params],
    queryFn: () => getAdminUsers(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserRoleData) => updateUserRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...DASHBOARD_QUERY_KEY, "admin", "users"],
      });
      queryClient.invalidateQueries({
        queryKey: [...DASHBOARD_QUERY_KEY, "admin", "stats"],
      });
    },
  });
};
