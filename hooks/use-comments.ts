"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type {
    Comment,
    CommentsResponse,
    MyCommentsResponse,
    AllCommentsResponse,
    CommentFilters,
} from "@/types/api";

// Query keys
export const commentKeys = {
    all: ["comments"] as const,
    lists: () => [...commentKeys.all, "list"] as const,
    list: (postId: string) => [...commentKeys.lists(), postId] as const,
    myComments: () => [...commentKeys.all, "my-comments"] as const,
    allComments: () => [...commentKeys.all, "all-comments"] as const,
    allCommentsList: (filters: CommentFilters) => [...commentKeys.allComments(), filters] as const,
};

// Get comments for a post
export function useComments(postId: string) {
    return useQuery({
        queryKey: commentKeys.list(postId),
        queryFn: async () => {
            const response = await api.get<CommentsResponse>(`/api/comments/posts/${postId}`);
            return response;
        },
        enabled: !!postId,
    });
}

// Create comment
export function useCreateComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
            return await api.post<Comment>(`/api/comments/posts/${postId}`, { content });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: commentKeys.list(variables.postId) });
        },
    });
}

// Update comment
export function useUpdateComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            content,
            postId,
        }: {
            id: string;
            content: string;
            postId: string;
        }) => {
            return await api.put<Comment>(`/api/comments/${id}`, { content });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: commentKeys.list(variables.postId) });
            queryClient.invalidateQueries({ queryKey: commentKeys.myComments() });
        },
    });
}

// Delete comment
export function useDeleteComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, postId }: { id: string; postId: string }) => {
            return await api.delete(`/api/comments/${id}`);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: commentKeys.list(variables.postId) });
            queryClient.invalidateQueries({ queryKey: commentKeys.myComments() });
        },
    });
}

// Get all comments by current user
export function useMyComments() {
    return useQuery({
        queryKey: commentKeys.myComments(),
        queryFn: async () => {
            const response = await api.get<MyCommentsResponse>("/api/comments/my-comments");
            return response;
        },
    });
}

// Get all comments (admin only)
export function useAllComments(filters: CommentFilters = {}) {
    const params = new URLSearchParams();

    if (filters.page) params.set("page", filters.page.toString());
    if (filters.limit) params.set("limit", filters.limit.toString());
    if (filters.search) params.set("search", filters.search);
    if (filters.authorId) params.set("authorId", filters.authorId);
    if (filters.postId) params.set("postId", filters.postId);

    const queryString = params.toString();
    const url = `/api/comments/all${queryString ? `?${queryString}` : ""}`;

    return useQuery({
        queryKey: commentKeys.allCommentsList(filters),
        queryFn: async () => {
            const response = await api.get<AllCommentsResponse>(url);
            return response;
        },
    });
}
