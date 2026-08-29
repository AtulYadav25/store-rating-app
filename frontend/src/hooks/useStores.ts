import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  getStores,
  getStore,
  addStore,
  editStore,
  type GetStoresParams,
  type AddStoreData,
  type EditStoreData,
} from "../api/store.api";
import { DASHBOARD_QUERY_KEY } from "./useDashboard";

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

export const useAddStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddStoreData) => addStore(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STORES_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...DASHBOARD_QUERY_KEY, "admin", "stats"],
      });
    },
  });
};

export const useEditStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      storeId,
      data,
    }: {
      storeId: string;
      data: EditStoreData;
    }) => editStore(storeId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: STORES_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...STORES_QUERY_KEY, variables.storeId],
      });
      queryClient.invalidateQueries({
        queryKey: [...DASHBOARD_QUERY_KEY, "admin", "stats"],
      });
    },
  });
};
