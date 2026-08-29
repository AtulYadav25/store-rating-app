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
  createdAt?: string;
  updatedAt?: string;
}

export interface GetStoresParams {
  page?: number;
  limit?: number;
  search?: string;
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
