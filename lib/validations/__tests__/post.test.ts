import { describe, it, expect } from "vitest";
import { postFormSchema, publishRequestSchema } from "../post";

describe("post validation schemas", () => {
    describe("postFormSchema", () => {
        describe("title field", () => {
            it("accepts valid title", () => {
                const result = postFormSchema.safeParse({
                    title: "My Blog Post Title",
                    content: "A".repeat(50), // Min 50 characters
                    tags: [],
                });

                expect(result.success).toBe(true);
            });

            it("rejects empty title", () => {
                const result = postFormSchema.safeParse({
                    title: "",
                    content: "A".repeat(50),
                    tags: [],
                });

                expect(result.success).toBe(false);
                if (!result.success) {
                    expect(result.error.issues[0].message).toBe("Title is required");
                }
            });

            it("rejects title longer than 200 characters", () => {
                const result = postFormSchema.safeParse({
                    title: "A".repeat(201),
                    content: "B".repeat(50),
                    tags: [],
                });

                expect(result.success).toBe(false);
                if (!result.success) {
                    expect(result.error.issues[0].message).toBe(
                        "Title must be less than 200 characters",
                    );
                }
            });

            it("accepts title with exactly 200 characters", () => {
                const result = postFormSchema.safeParse({
                    title: "A".repeat(200),
                    content: "B".repeat(50),
                    tags: [],
                });

                expect(result.success).toBe(true);
            });
        });

        describe("content field", () => {
            it("accepts valid content", () => {
                const result = postFormSchema.safeParse({
                    title: "Title",
                    content: "This is a blog post with enough content to pass validation",
                    tags: [],
                });

                expect(result.success).toBe(true);
            });

            it("rejects empty content", () => {
                const result = postFormSchema.safeParse({
                    title: "Title",
                    content: "",
                    tags: [],
                });

                expect(result.success).toBe(false);
                if (!result.success) {
                    expect(result.error.issues[0].message).toBe("Content is required");
                }
            });

            it("rejects content shorter than 50 characters", () => {
                const result = postFormSchema.safeParse({
                    title: "Title",
                    content: "Too short",
                    tags: [],
                });

                expect(result.success).toBe(false);
                if (!result.success) {
                    expect(result.error.issues[0].message).toBe(
                        "Content must be at least 50 characters",
                    );
                }
            });

            it("accepts content with exactly 50 characters", () => {
                const result = postFormSchema.safeParse({
                    title: "Title",
                    content: "A".repeat(50),
                    tags: [],
                });

                expect(result.success).toBe(true);
            });
        });

        describe("excerpt field", () => {
            it("is optional - accepts undefined", () => {
                const result = postFormSchema.safeParse({
                    title: "Title",
                    content: "A".repeat(50),
                    tags: [],
                });

                expect(result.success).toBe(true);
            });

            it("accepts empty string", () => {
                const result = postFormSchema.safeParse({
                    title: "Title",
                    content: "A".repeat(50),
                    excerpt: "",
                    tags: [],
                });

                expect(result.success).toBe(true);
            });

            it("accepts valid excerpt", () => {
                const result = postFormSchema.safeParse({
                    title: "Title",
                    content: "A".repeat(50),
                    excerpt: "This is a short excerpt for the post",
                    tags: [],
                });

                expect(result.success).toBe(true);
            });

            it("rejects excerpt longer than 300 characters", () => {
                const result = postFormSchema.safeParse({
                    title: "Title",
                    content: "A".repeat(50),
                    excerpt: "A".repeat(301),
                    tags: [],
                });

                expect(result.success).toBe(false);
                if (!result.success) {
                    expect(result.error.issues[0].message).toBe(
                        "Excerpt must be less than 300 characters",
                    );
                }
            });

            it("accepts excerpt with exactly 300 characters", () => {
                const result = postFormSchema.safeParse({
                    title: "Title",
                    content: "A".repeat(50),
                    excerpt: "A".repeat(300),
                    tags: [],
                });

                expect(result.success).toBe(true);
            });
        });

        describe("coverImage field", () => {
            it("is optional - accepts undefined", () => {
                const result = postFormSchema.safeParse({
                    title: "Title",
                    content: "A".repeat(50),
                    tags: [],
                });

                expect(result.success).toBe(true);
            });

            it("accepts empty string", () => {
                const result = postFormSchema.safeParse({
                    title: "Title",
                    content: "A".repeat(50),
                    coverImage: "",
                    tags: [],
                });

                expect(result.success).toBe(true);
            });

            it("accepts valid URL", () => {
                const result = postFormSchema.safeParse({
                    title: "Title",
                    content: "A".repeat(50),
                    coverImage: "https://example.com/image.jpg",
                    tags: [],
                });

                expect(result.success).toBe(true);
            });

            it("rejects invalid URL", () => {
                const result = postFormSchema.safeParse({
                    title: "Title",
                    content: "A".repeat(50),
                    coverImage: "not-a-valid-url",
                    tags: [],
                });

                expect(result.success).toBe(false);
                if (!result.success) {
                    expect(result.error.issues[0].message).toBe("Must be a valid URL");
                }
            });

            it("accepts http URL", () => {
                const result = postFormSchema.safeParse({
                    title: "Title",
                    content: "A".repeat(50),
                    coverImage: "http://example.com/image.jpg",
                    tags: [],
                });

                expect(result.success).toBe(true);
            });
        });

        describe("tags field", () => {
            it("accepts empty array", () => {
                const result = postFormSchema.safeParse({
                    title: "Title",
                    content: "A".repeat(50),
                    tags: [],
                });

                expect(result.success).toBe(true);
            });

            it("accepts array with tags", () => {
                const result = postFormSchema.safeParse({
                    title: "Title",
                    content: "A".repeat(50),
                    tags: ["javascript", "typescript", "react"],
                });

                expect(result.success).toBe(true);
            });

            it("accepts exactly 5 tags", () => {
                const result = postFormSchema.safeParse({
                    title: "Title",
                    content: "A".repeat(50),
                    tags: ["tag1", "tag2", "tag3", "tag4", "tag5"],
                });

                expect(result.success).toBe(true);
            });

            it("rejects more than 5 tags", () => {
                const result = postFormSchema.safeParse({
                    title: "Title",
                    content: "A".repeat(50),
                    tags: ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"],
                });

                expect(result.success).toBe(false);
                if (!result.success) {
                    expect(result.error.issues[0].message).toBe("Maximum 5 tags allowed");
                }
            });
        });

        describe("complete form validation", () => {
            it("accepts valid complete form data", () => {
                const result = postFormSchema.safeParse({
                    title: "My Awesome Blog Post",
                    content: "This is a comprehensive blog post about testing with Vitest and React Testing Library. It contains enough content to pass the minimum character requirement.",
                    excerpt: "Learn how to test your React applications effectively",
                    coverImage: "https://example.com/cover.jpg",
                    tags: ["testing", "react", "vitest"],
                });

                expect(result.success).toBe(true);
            });

            it("returns parsed data when valid", () => {
                const input = {
                    title: "Test Post",
                    content: "A".repeat(50),
                    excerpt: "Short excerpt",
                    coverImage: "https://example.com/image.jpg",
                    tags: ["test"],
                };

                const result = postFormSchema.safeParse(input);

                expect(result.success).toBe(true);
                if (result.success) {
                    expect(result.data).toEqual(input);
                }
            });
        });
    });

    describe("publishRequestSchema", () => {
        it("is optional - accepts undefined message", () => {
            const result = publishRequestSchema.safeParse({});

            expect(result.success).toBe(true);
        });

        it("accepts empty string message", () => {
            const result = publishRequestSchema.safeParse({
                message: "",
            });

            expect(result.success).toBe(true);
        });

        it("accepts valid message", () => {
            const result = publishRequestSchema.safeParse({
                message: "Please review my post for publication",
            });

            expect(result.success).toBe(true);
        });

        it("accepts message with exactly 500 characters", () => {
            const result = publishRequestSchema.safeParse({
                message: "A".repeat(500),
            });

            expect(result.success).toBe(true);
        });

        it("rejects message longer than 500 characters", () => {
            const result = publishRequestSchema.safeParse({
                message: "A".repeat(501),
            });

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(
                    "Message must be less than 500 characters",
                );
            }
        });
    });
});
