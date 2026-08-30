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
  getOwnerStoreRatings,
  type GetAdminUsersParams,
  type UpdateUserRoleData,
  type GetOwnerStoreRatingsParams,
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

export const useOwnerStoreRatings = (
  params: GetOwnerStoreRatingsParams = {}
) => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "owner", "ratings", params],
    queryFn: () => getOwnerStoreRatings(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  });
};
