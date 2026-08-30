import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  getStoreRatings,
  submitRating,
  updateRating,
  deleteRating,
  type GetStoreRatingsParams,
  type SubmitRatingData,
} from "../api/rating.api";
import { STORES_QUERY_KEY } from "./useStores";

export const RATINGS_QUERY_KEY = ["ratings"] as const;

export const useStoreRatings = ({
  storeId,
  page = 1,
  limit = 5,
}: GetStoreRatingsParams) => {
  return useQuery({
    queryKey: [...RATINGS_QUERY_KEY, storeId, { page, limit }],
    queryFn: () => getStoreRatings({ storeId, page, limit }),
    placeholderData: keepPreviousData,
    enabled: Boolean(storeId),
    staleTime: 1000 * 60,
  });
};

export const useSubmitRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitRatingData) => submitRating(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...RATINGS_QUERY_KEY, variables.storeId] });
      queryClient.invalidateQueries({ queryKey: [...STORES_QUERY_KEY, variables.storeId] });
      queryClient.invalidateQueries({ queryKey: STORES_QUERY_KEY });
    },
  });
};

export const useUpdateRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { ratingId: string; rating: number; storeId?: string }) =>
      updateRating({ ratingId: data.ratingId, rating: data.rating }),
    onSuccess: (_, variables) => {
      if (variables.storeId) {
        queryClient.invalidateQueries({ queryKey: [...RATINGS_QUERY_KEY, variables.storeId] });
        queryClient.invalidateQueries({ queryKey: [...STORES_QUERY_KEY, variables.storeId] });
      }
      queryClient.invalidateQueries({ queryKey: STORES_QUERY_KEY });
    },
  });
};

export const useDeleteRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (storeId: string) => deleteRating(storeId),
    onSuccess: (_, storeId) => {
      queryClient.invalidateQueries({ queryKey: [...RATINGS_QUERY_KEY, storeId] });
      queryClient.invalidateQueries({ queryKey: [...STORES_QUERY_KEY, storeId] });
      queryClient.invalidateQueries({ queryKey: STORES_QUERY_KEY });
    },
  });
};

