/**
 * API Client - Type-safe fetch wrapper for backend API calls
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export class APIError extends Error {
    constructor(
        public status: number,
        message: string,
        public data?: unknown,
    ) {
        super(message);
        this.name = "APIError";
    }
}

interface RequestOptions extends RequestInit {
    params?: Record<string, string | number | boolean | undefined>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...fetchOptions } = options;

    // Build URL with query params
    let url = `${API_BASE_URL}${endpoint}`;
    if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                searchParams.append(key, String(value));
            }
        });
        const queryString = searchParams.toString();
        if (queryString) {
            url += `?${queryString}`;
        }
    }

    // Default headers
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
    };

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            headers,
            credentials: "include", // Include cookies for Better-Auth
        });

        // Handle non-JSON responses
        const contentType = response.headers.get("content-type");
        const isJson = contentType?.includes("application/json");

        if (!response.ok) {
            const errorData = isJson ? await response.json() : await response.text();
            throw new APIError(
                response.status,
                errorData?.error || errorData?.message || "An error occurred",
                errorData,
            );
        }

        return isJson ? await response.json() : ((await response.text()) as T);
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        // Network or other errors
        throw new APIError(0, error instanceof Error ? error.message : "Network error");
    }
}

export const api = {
    get: <T>(endpoint: string, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: "GET" }),

    post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
        request<T>(endpoint, {
            ...options,
            method: "POST",
            body: data ? JSON.stringify(data) : undefined,
        }),

    put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
        request<T>(endpoint, {
            ...options,
            method: "PUT",
            body: data ? JSON.stringify(data) : undefined,
        }),

    patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
        request<T>(endpoint, {
            ...options,
            method: "PATCH",
            body: data ? JSON.stringify(data) : undefined,
        }),

    delete: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
        request<T>(endpoint, {
            ...options,
            method: "DELETE",
            body: data ? JSON.stringify(data) : undefined,
        }),

    // Special handler for FormData (e.g., image uploads)
    postFormData: <T>(endpoint: string, formData: FormData, options?: RequestOptions) => {
        const { headers, ...restOptions } = options || {};
        return request<T>(endpoint, {
            ...restOptions,
            method: "POST",
            body: formData,
            headers: {
                // Don't set Content-Type for FormData - browser will set it with boundary
                ...headers,
                "Content-Type": undefined,
            } as HeadersInit,
        });
    },
};
