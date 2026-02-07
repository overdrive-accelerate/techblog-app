import { z } from "zod";

export const postFormSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .max(200, "Title must be less than 200 characters"),
    content: z
        .string()
        .min(1, "Content is required")
        .min(50, "Content must be at least 50 characters"),
    excerpt: z
        .string()
        .max(300, "Excerpt must be less than 300 characters")
        .optional()
        .or(z.literal("")),
    coverImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    tags: z.array(z.string()).max(5, "Maximum 5 tags allowed"),
});

export type PostFormData = z.infer<typeof postFormSchema>;

export const publishRequestSchema = z.object({
    message: z
        .string()
        .max(500, "Message must be less than 500 characters")
        .optional()
        .or(z.literal("")),
});

export type PublishRequestData = z.infer<typeof publishRequestSchema>;
