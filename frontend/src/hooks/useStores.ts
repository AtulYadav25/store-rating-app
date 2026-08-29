import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getStores, getStore, type GetStoresParams } from "../api/store.api";

export const STORES_QUERY_KEY = ["stores"] as const;

export const useStores = (params: GetStoresParams = {}) => {
  const { page = 1, limit = 9, search = "" } = params;

  return useQuery({
    queryKey: [...STORES_QUERY_KEY, { page, limit, search }],
    queryFn: () => getStores({ page, limit, search }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2,
  });
};

export const useStore = (id: string) => {
  return useQuery({
    queryKey: [...STORES_QUERY_KEY, id],
    queryFn: () => getStore(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 2,
  });
};
