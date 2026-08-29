import { api, type APIResponse } from "./axios";
import type { UserRole } from "../constants/ROLES";

export interface UpdatePasswordData {
  oldPassword: string;
  newPassword: string;
}

export interface AddUserData {
  name: string;
  email: string;
  address: string;
  password: string;
  role: UserRole;
}

export interface AddedUserResponse {
  id: string;
  email: string;
  name: string;
  role: UserRole;
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

export const addUser = async (
  data: AddUserData
): Promise<APIResponse<AddedUserResponse>> => {
  const response = await api.post<APIResponse<AddedUserResponse>>(
    "/user/add-user",
    data
  );
  return response.data;
};
