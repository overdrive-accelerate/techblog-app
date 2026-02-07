"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { postKeys } from "@/hooks/use-posts";
import { myPostsKeys } from "@/hooks/use-my-posts";

export interface PublishRequest {
    id: string;
    postId: string;
    authorId: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    message?: string | null;
    createdAt: string;
    updatedAt: string;
    post: {
        id: string;
        title: string;
        slug: string;
        status?: string;
    };
    author?: {
        id: string;
        name: string;
        email: string;
        image?: string;
    };
}

export interface PublishRequestsResponse {
    requests: PublishRequest[];
}

// Query keys
export const publishKeys = {
    all: ["publish"] as const,
    myRequests: () => [...publishKeys.all, "my-requests"] as const,
    adminRequests: (status?: string) => [...publishKeys.all, "admin-requests", status] as const,
};

// Get my publish requests
export function useMyPublishRequests() {
    return useQuery({
        queryKey: publishKeys.myRequests(),
        queryFn: async () => {
            const response = await api.get<PublishRequestsResponse>("/api/publish/my-requests");
            return response;
        },
    });
}

// Get all publish requests (admin)
export function usePublishRequests(status?: string) {
    return useQuery({
        queryKey: publishKeys.adminRequests(status),
        queryFn: async () => {
            const params = status ? { status } : {};
            const response = await api.get<PublishRequestsResponse>("/api/publish/requests", {
                params,
            });
            return response;
        },
    });
}

// Request publish
export function useRequestPublish() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ postId, message }: { postId: string; message?: string }) => {
            return await api.post<PublishRequest>(`/api/publish/posts/${postId}/request`, {
                message,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: publishKeys.myRequests() });
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });
            queryClient.invalidateQueries({ queryKey: myPostsKeys.lists() });
        },
    });
}

// Cancel publish request
export function useCancelPublishRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (requestId: string) => {
            return await api.delete(`/api/publish/requests/${requestId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: publishKeys.myRequests() });
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });
            queryClient.invalidateQueries({ queryKey: myPostsKeys.lists() });
        },
    });
}

// Approve publish request (admin)
export function useApprovePublishRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ requestId, message }: { requestId: string; message?: string }) => {
            return await api.post<PublishRequest>(`/api/publish/requests/${requestId}/approve`, {
                message,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: publishKeys.all });
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });
        },
    });
}

// Reject publish request (admin)
export function useRejectPublishRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ requestId, message }: { requestId: string; message?: string }) => {
            return await api.post<PublishRequest>(`/api/publish/requests/${requestId}/reject`, {
                message,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: publishKeys.all });
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });
        },
    });
}
