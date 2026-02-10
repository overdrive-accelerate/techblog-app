import { http, HttpResponse } from "msw";

const API_BASE_URL = "http://localhost:3001";

/**
 * MSW handlers for mocking API requests in tests
 * These are default handlers that can be overridden in individual tests
 */
export const handlers = [
    // Auth endpoints
    http.get(`${API_BASE_URL}/api/auth/me`, () => {
        return HttpResponse.json({
            user: null,
        });
    }),

    http.post(`${API_BASE_URL}/api/auth/login`, () => {
        return HttpResponse.json({
            user: {
                id: "test-user-id",
                email: "test@example.com",
                name: "Test User",
                role: "AUTHOR",
            },
        });
    }),

    http.post(`${API_BASE_URL}/api/auth/signup`, () => {
        return HttpResponse.json({
            user: {
                id: "test-user-id",
                email: "test@example.com",
                name: "Test User",
                role: "AUTHOR",
            },
        });
    }),

    // Posts endpoints
    http.get(`${API_BASE_URL}/api/posts`, () => {
        return HttpResponse.json({
            posts: [],
            total: 0,
            page: 1,
            limit: 10,
        });
    }),

    http.get(`${API_BASE_URL}/api/posts/:id`, ({ params }) => {
        return HttpResponse.json({
            id: params.id,
            title: "Test Post",
            content: "Test content",
            excerpt: "Test excerpt",
            status: "PUBLISHED",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
    }),

    // Comments endpoints
    http.get(`${API_BASE_URL}/api/posts/:postId/comments`, () => {
        return HttpResponse.json({
            comments: [],
        });
    }),

    // Tags endpoints
    http.get(`${API_BASE_URL}/api/tags`, () => {
        return HttpResponse.json({
            tags: [],
        });
    }),
];
