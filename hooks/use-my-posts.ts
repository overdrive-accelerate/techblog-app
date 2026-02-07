"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";
import type { PostsResponse, PostFilters } from "@/types/api";

// Query keys
export const myPostsKeys = {
    all: ["my-posts"] as const,
    lists: () => [...myPostsKeys.all, "list"] as const,
    list: (filters: PostFilters) => [...myPostsKeys.lists(), filters] as const,
};

// Get current user's posts with filters
export function useMyPosts(filters: Omit<PostFilters, "authorId"> = {}) {
    const { user } = useAuth();

    return useQuery({
        queryKey: myPostsKeys.list({ ...filters, authorId: user?.id }),
        queryFn: async () => {
            if (!user?.id) {
                throw new Error("User not authenticated");
            }

            const response = await api.get<PostsResponse>("/api/posts", {
                params: {
                    ...filters,
                    authorId: user.id,
                } as Record<string, string | number | boolean | undefined>,
            });
            return response;
        },
        enabled: !!user?.id,
    });
}
