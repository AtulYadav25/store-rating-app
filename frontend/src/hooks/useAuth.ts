import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    login,
    register,
    logout,
    getMe,
    type AuthResponse,
} from "../api/auth.api";

export const AUTH_QUERY_KEY = ["auth", "me"] as const;

export const useCurrentUser = () => {
    return useQuery({
        queryKey: AUTH_QUERY_KEY,
        queryFn: getMe,
        retry: false,
        staleTime: Infinity,
        gcTime: 1000 * 60 * 60,
        select: (data) => data?.data?.user,
    });
};

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: login,
        onSuccess: (data: AuthResponse) => {
            queryClient.setQueryData(AUTH_QUERY_KEY, data);
        },
    });
};

export const useRegister = () => {
    return useMutation({
        mutationFn: register,
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.setQueryData(AUTH_QUERY_KEY, null);
            queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
            queryClient.clear();
        },
    });
};
