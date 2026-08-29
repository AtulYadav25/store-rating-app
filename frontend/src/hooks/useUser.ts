import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updatePassword,
  addUser,
  type UpdatePasswordData,
  type AddUserData,
} from "../api/user.api";
import { DASHBOARD_QUERY_KEY } from "./useDashboard";

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (data: UpdatePasswordData) => updatePassword(data),
  });
};

export const useAddUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddUserData) => addUser(data),
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
