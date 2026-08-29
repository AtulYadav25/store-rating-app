import { api, type APIResponse } from "./axios";

export interface UpdatePasswordData {
  oldPassword: string;
  newPassword: string;
}

export const updatePassword = async (
  data: UpdatePasswordData
): Promise<APIResponse<Record<string, never>>> => {
  const response = await api.post<APIResponse<Record<string, never>>>(
    "/user/update-password",
    data
  );
  return response.data;
};
