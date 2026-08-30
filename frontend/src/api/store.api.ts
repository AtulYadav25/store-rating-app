import { api, type PaginatedAPIResponse, type APIResponse } from "./axios";

export interface Store {
  id: string;
  name: string;
  address: string;
  email: string;
  image?: string | null;
  avgRating: number;
  ratingCount: number;
  ownerId?: string | null;
  owner?: {
    id: string;
    name: string;
    email: string;
  } | null;
  userRating?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetStoresParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface AddStoreData {
  name: string;
  email: string;
  address: string;
  image?: string | null;
  ownerEmail?: string | null;
}

export interface EditStoreData {
  name?: string;
  email?: string;
  address?: string;
  image?: string | null;
  ownerEmail?: string | null;
}

export type StoresResponse = PaginatedAPIResponse<Store>;
export type StoreDetailResponse = APIResponse<Store>;

export const getStores = async (params: GetStoresParams = {}): Promise<StoresResponse> => {
  const { page = 1, limit = 9, search = "" } = params;
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(page));
  searchParams.set("limit", String(limit));
  if (search.trim()) {
    searchParams.set("search", search.trim());
  }

  const response = await api.get<StoresResponse>(`/store?${searchParams.toString()}`);
  return response.data;
};

export const getStore = async (id: string): Promise<StoreDetailResponse> => {
  const response = await api.get<StoreDetailResponse>(`/store/${id}`);
  return response.data;
};

export const addStore = async (data: AddStoreData): Promise<APIResponse<Store>> => {
  const response = await api.post<APIResponse<Store>>("/store", data);
  return response.data;
};

export const editStore = async (
  storeId: string,
  data: EditStoreData
): Promise<APIResponse<Store>> => {
  const response = await api.put<APIResponse<Store>>(`/store/${storeId}`, data);
  return response.data;
};

export const deleteStore = async (
  storeId: string
): Promise<APIResponse<Record<string, never>>> => {
  const response = await api.delete<APIResponse<Record<string, never>>>(
    `/store/${storeId}`
  );
  return response.data;
};
