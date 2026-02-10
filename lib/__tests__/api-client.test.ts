import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../../__tests__/mocks/server";
import { api, APIError, API_BASE_URL } from "../api-client";

describe("api-client", () => {
    describe("api.get", () => {
        it("makes successful GET request", async () => {
            server.use(
                http.get(`${API_BASE_URL}/api/posts`, () => {
                    return HttpResponse.json({
                        posts: [
                            { id: "1", title: "Test Post" },
                            { id: "2", title: "Another Post" },
                        ],
                    });
                }),
            );

            const result = await api.get<{ posts: Array<{ id: string; title: string }> }>(
                "/api/posts",
            );

            expect(result.posts).toHaveLength(2);
            expect(result.posts[0].title).toBe("Test Post");
        });

        it("includes query parameters in URL", async () => {
            let requestUrl = "";

            server.use(
                http.get(`${API_BASE_URL}/api/posts`, ({ request }) => {
                    requestUrl = request.url;
                    return HttpResponse.json({ posts: [] });
                }),
            );

            await api.get("/api/posts", {
                params: { page: 1, limit: 10, status: "PUBLISHED" },
            });

            expect(requestUrl).toContain("page=1");
            expect(requestUrl).toContain("limit=10");
            expect(requestUrl).toContain("status=PUBLISHED");
        });

        it("skips undefined query parameters", async () => {
            let requestUrl = "";

            server.use(
                http.get(`${API_BASE_URL}/api/posts`, ({ request }) => {
                    requestUrl = request.url;
                    return HttpResponse.json({ posts: [] });
                }),
            );

            await api.get("/api/posts", {
                params: { page: 1, status: undefined },
            });

            expect(requestUrl).toContain("page=1");
            expect(requestUrl).not.toContain("status");
        });

        it("throws APIError on 404", async () => {
            server.use(
                http.get(`${API_BASE_URL}/api/posts/999`, () => {
                    return HttpResponse.json(
                        { error: "Post not found" },
                        { status: 404 },
                    );
                }),
            );

            await expect(api.get("/api/posts/999")).rejects.toThrow(APIError);
            await expect(api.get("/api/posts/999")).rejects.toMatchObject({
                status: 404,
                message: "Post not found",
            });
        });

        it("throws APIError on 500", async () => {
            server.use(
                http.get(`${API_BASE_URL}/api/posts`, () => {
                    return HttpResponse.json(
                        { error: "Internal server error" },
                        { status: 500 },
                    );
                }),
            );

            await expect(api.get("/api/posts")).rejects.toThrow(APIError);
            await expect(api.get("/api/posts")).rejects.toMatchObject({
                status: 500,
                message: "Internal server error",
            });
        });
    });

    describe("api.post", () => {
        it("makes successful POST request with JSON body", async () => {
            let requestBody: unknown;

            server.use(
                http.post(`${API_BASE_URL}/api/posts`, async ({ request }) => {
                    requestBody = await request.json();
                    return HttpResponse.json({
                        id: "1",
                        title: "New Post",
                        content: "Post content",
                    });
                }),
            );

            const data = { title: "New Post", content: "Post content" };
            const result = await api.post<{ id: string; title: string; content: string }>(
                "/api/posts",
                data,
            );

            expect(requestBody).toEqual(data);
            expect(result.id).toBe("1");
            expect(result.title).toBe("New Post");
        });

        it("sends Content-Type: application/json header", async () => {
            let contentType = "";

            server.use(
                http.post(`${API_BASE_URL}/api/posts`, ({ request }) => {
                    contentType = request.headers.get("Content-Type") || "";
                    return HttpResponse.json({ id: "1" });
                }),
            );

            await api.post("/api/posts", { title: "Test" });

            expect(contentType).toBe("application/json");
        });

        it("includes credentials in request", async () => {
            let hasCredentials = false;

            server.use(
                http.post(`${API_BASE_URL}/api/posts`, ({ request }) => {
                    hasCredentials = request.credentials === "include";
                    return HttpResponse.json({ id: "1" });
                }),
            );

            await api.post("/api/posts", { title: "Test" });

            expect(hasCredentials).toBe(true);
        });
    });

    describe("api.put", () => {
        it("makes successful PUT request", async () => {
            let requestBody: unknown;

            server.use(
                http.put(`${API_BASE_URL}/api/posts/1`, async ({ request }) => {
                    requestBody = await request.json();
                    return HttpResponse.json({
                        id: "1",
                        title: "Updated Post",
                    });
                }),
            );

            const data = { title: "Updated Post" };
            const result = await api.put<{ id: string; title: string }>("/api/posts/1", data);

            expect(requestBody).toEqual(data);
            expect(result.title).toBe("Updated Post");
        });
    });

    describe("api.patch", () => {
        it("makes successful PATCH request", async () => {
            server.use(
                http.patch(`${API_BASE_URL}/api/posts/1`, () => {
                    return HttpResponse.json({
                        id: "1",
                        status: "PUBLISHED",
                    });
                }),
            );

            const result = await api.patch<{ id: string; status: string }>(
                "/api/posts/1",
                { status: "PUBLISHED" },
            );

            expect(result.status).toBe("PUBLISHED");
        });
    });

    describe("api.delete", () => {
        it("makes successful DELETE request", async () => {
            server.use(
                http.delete(`${API_BASE_URL}/api/posts/1`, () => {
                    return HttpResponse.json({ success: true });
                }),
            );

            const result = await api.delete<{ success: boolean }>("/api/posts/1");

            expect(result.success).toBe(true);
        });

        it("can send body with DELETE request", async () => {
            let requestBody: unknown;

            server.use(
                http.delete(`${API_BASE_URL}/api/posts/bulk`, async ({ request }) => {
                    requestBody = await request.json();
                    return HttpResponse.json({ deleted: 3 });
                }),
            );

            await api.delete("/api/posts/bulk", { ids: ["1", "2", "3"] });

            expect(requestBody).toEqual({ ids: ["1", "2", "3"] });
        });
    });

    describe("api.postFormData", () => {
        it("sends FormData with body", async () => {
            let requestReceived = false;

            server.use(
                http.post(`${API_BASE_URL}/api/upload`, () => {
                    requestReceived = true;
                    return HttpResponse.json({ url: "https://example.com/image.jpg" });
                }),
            );

            const formData = new FormData();
            formData.append("file", new Blob(["test"], { type: "image/jpeg" }), "test.jpg");

            await api.postFormData("/api/upload", formData);

            // Verify request was sent successfully
            expect(requestReceived).toBe(true);
        });

        it("successfully uploads file", async () => {
            server.use(
                http.post(`${API_BASE_URL}/api/upload`, () => {
                    return HttpResponse.json({
                        url: "https://example.com/image.jpg",
                        filename: "test.jpg",
                    });
                }),
            );

            const formData = new FormData();
            formData.append("file", new Blob(["test"], { type: "image/jpeg" }), "test.jpg");

            const result = await api.postFormData<{ url: string; filename: string }>(
                "/api/upload",
                formData,
            );

            expect(result.url).toBe("https://example.com/image.jpg");
            expect(result.filename).toBe("test.jpg");
        });
    });

    describe("APIError", () => {
        it("creates error with status, message, and data", () => {
            const error = new APIError(404, "Not found", { id: "123" });

            expect(error.name).toBe("APIError");
            expect(error.status).toBe(404);
            expect(error.message).toBe("Not found");
            expect(error.data).toEqual({ id: "123" });
        });

        it("is instance of Error", () => {
            const error = new APIError(500, "Server error");

            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(APIError);
        });
    });

    describe("error handling", () => {
        it("handles network errors", async () => {
            server.use(
                http.get(`${API_BASE_URL}/api/posts`, () => {
                    return HttpResponse.error();
                }),
            );

            await expect(api.get("/api/posts")).rejects.toThrow(APIError);
            await expect(api.get("/api/posts")).rejects.toMatchObject({
                status: 0,
                message: expect.stringContaining(""),
            });
        });

        it("handles non-JSON error responses", async () => {
            server.use(
                http.get(`${API_BASE_URL}/api/posts`, () => {
                    return new HttpResponse("Internal Server Error", {
                        status: 500,
                        headers: { "Content-Type": "text/plain" },
                    });
                }),
            );

            await expect(api.get("/api/posts")).rejects.toThrow(APIError);
        });

        it("uses error.message from JSON response if available", async () => {
            server.use(
                http.get(`${API_BASE_URL}/api/posts`, () => {
                    return HttpResponse.json(
                        { message: "Custom error message" },
                        { status: 400 },
                    );
                }),
            );

            await expect(api.get("/api/posts")).rejects.toMatchObject({
                message: "Custom error message",
            });
        });

        it("uses error.error from JSON response as fallback", async () => {
            server.use(
                http.get(`${API_BASE_URL}/api/posts`, () => {
                    return HttpResponse.json({ error: "Validation failed" }, { status: 400 });
                }),
            );

            await expect(api.get("/api/posts")).rejects.toMatchObject({
                message: "Validation failed",
            });
        });
    });
});
