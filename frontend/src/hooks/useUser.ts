import { useMutation } from "@tanstack/react-query";
import { updatePassword, type UpdatePasswordData } from "../api/user.api";

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (data: UpdatePasswordData) => updatePassword(data),
  });
};
