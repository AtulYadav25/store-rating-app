import { api, type PaginatedAPIResponse, type APIResponse } from "./axios";

export interface RatingUser {
  id: string;
  name: string;
  email: string;
}

export interface RatingItem {
  id: string;
  userId: string;
  storeId: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user?: RatingUser;
}

export interface GetStoreRatingsParams {
  storeId: string;
  page?: number;
  limit?: number;
}

export type StoreRatingsResponse = PaginatedAPIResponse<RatingItem>;

export const getStoreRatings = async ({
  storeId,
  page = 1,
  limit = 5,
}: GetStoreRatingsParams): Promise<StoreRatingsResponse> => {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(page));
  searchParams.set("limit", String(limit));

  const response = await api.get<StoreRatingsResponse>(
    `/rating/${storeId}?${searchParams.toString()}`
  );
  return response.data;
};

export interface SubmitRatingData {
  storeId: string;
  rating: number;
}

export const submitRating = async ({
  storeId,
  rating,
}: SubmitRatingData): Promise<APIResponse<RatingItem>> => {
  const response = await api.post<APIResponse<RatingItem>>(`/rating/${storeId}`, {
    rating,
  });
  return response.data;
};

export const updateRating = async ({
  ratingId,
  rating,
}: {
  ratingId: string;
  rating: number;
}): Promise<APIResponse<RatingItem>> => {
  const response = await api.put<APIResponse<RatingItem>>(`/rating/${ratingId}`, {
    rating,
  });
  return response.data;
};
