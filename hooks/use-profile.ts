import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export interface UserProfile {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: "ADMIN" | "AUTHOR" | "READER";
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    profile: {
        bio: string | null;
        website: string | null;
    } | null;
    _count: {
        posts: number;
        comments: number;
    };
}

export interface UpdateProfileData {
    name?: string;
    bio?: string | null;
    website?: string | null;
}

// Query key factory
export const profileKeys = {
    all: ["profile"] as const,
    me: () => [...profileKeys.all, "me"] as const,
};

// Fetch current user's profile
export function useProfile() {
    return useQuery({
        queryKey: profileKeys.me(),
        queryFn: async () => {
            const response = await api.get<UserProfile>("/api/users/me");
            return response;
        },
    });
}

// Update current user's profile
export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UpdateProfileData) => {
            const response = await api.patch<UserProfile>("/api/users/me", data);
            return response;
        },
        onSuccess: (data) => {
            // Update the profile cache
            queryClient.setQueryData(profileKeys.me(), data);
            // Invalidate to ensure fresh data
            queryClient.invalidateQueries({ queryKey: profileKeys.me() });
        },
    });
}
