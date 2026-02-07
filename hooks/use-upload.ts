"use client";

import { useMutation } from "@tanstack/react-query";
import { api, API_BASE_URL } from "@/lib/api-client";

export interface UploadResponse {
    url: string;
    path: string;
    size: number;
    type: string;
}

// Upload image
export function useUploadImage() {
    return useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to upload image");
            }

            return response.json() as Promise<UploadResponse>;
        },
    });
}

// Delete image
export function useDeleteImage() {
    return useMutation({
        mutationFn: async (path: string) => {
            return await api.delete("/api/upload/image", { path });
        },
    });
}
