"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Tag, TagsResponse } from "@/types/api";

// Query keys
export const tagKeys = {
    all: ["tags"] as const,
    lists: () => [...tagKeys.all, "list"] as const,
    list: () => [...tagKeys.lists()] as const,
    details: () => [...tagKeys.all, "detail"] as const,
    detail: (slug: string) => [...tagKeys.details(), slug] as const,
};

// Get all tags
export function useTags() {
    return useQuery({
        queryKey: tagKeys.list(),
        queryFn: async () => {
            const response = await api.get<TagsResponse>("/api/tags");
            return response;
        },
        staleTime: 30 * 60 * 1000, // tags are mostly static
        gcTime: 60 * 60 * 1000,
    });
}

// Get single tag by slug
export function useTag(slug: string) {
    return useQuery({
        queryKey: tagKeys.detail(slug),
        queryFn: async () => {
            const response = await api.get<Tag>(`/api/tags/${slug}`);
            return response;
        },
        enabled: !!slug,
        staleTime: 30 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
    });
}

// Create tag (admin only)
export function useCreateTag() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { name: string; description?: string }) => {
            return await api.post<Tag>("/api/tags", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
        },
    });
}

// Update tag (admin only)
export function useUpdateTag() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: { name?: string; description?: string };
        }) => {
            return await api.put<Tag>(`/api/tags/${id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
            queryClient.invalidateQueries({ queryKey: tagKeys.details() });
        },
    });
}

// Delete tag (admin only)
export function useDeleteTag() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            return await api.delete(`/api/tags/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
        },
    });
}
