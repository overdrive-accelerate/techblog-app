"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { User, UsersResponse, UserFilters } from "@/types/api";

// Query key factory
export const userKeys = {
    all: ["users"] as const,
    lists: () => [...userKeys.all, "list"] as const,
    list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
    details: () => [...userKeys.all, "detail"] as const,
    detail: (id: string) => [...userKeys.details(), id] as const,
};

// Fetch users (admin only)
export function useUsers(filters: UserFilters = {}) {
    const params = new URLSearchParams();

    if (filters.page) params.set("page", filters.page.toString());
    if (filters.limit) params.set("limit", filters.limit.toString());
    if (filters.search) params.set("search", filters.search);
    if (filters.role) params.set("role", filters.role);

    const queryString = params.toString();
    const url = `/api/users${queryString ? `?${queryString}` : ""}`;

    return useQuery({
        queryKey: userKeys.list(filters),
        queryFn: async () => {
            const response = await api.get<UsersResponse>(url);
            return response;
        },
        staleTime: 5 * 60 * 1000, // admin lists change infrequently
        gcTime: 20 * 60 * 1000,
    });
}

// Update user role
export function useUpdateUserRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            userId,
            role,
        }: {
            userId: string;
            role: "ADMIN" | "AUTHOR" | "READER";
        }) => {
            const response = await api.patch<User>(`/api/users/${userId}/role`, {
                role,
            });
            return response;
        },
        onSuccess: () => {
            // Invalidate user queries to refetch
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
    });
}
