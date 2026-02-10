import { MetadataRoute } from "next";
import { API_BASE_URL } from "@/lib/api-client";
import type { PostsResponse, TagsResponse } from "@/types/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/posts`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/tags`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
        },
    ];

    try {
        // Fetch published posts
        const postsResponse = await fetch(`${API_BASE_URL}/api/posts?status=PUBLISHED&limit=1000`);
        const postsData: PostsResponse = await postsResponse.json();
        const posts = postsData.posts || [];

        const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
            url: `${baseUrl}/posts/${post.slug}`,
            lastModified: new Date(post.updatedAt),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }));

        // Fetch tags
        const tagsResponse = await fetch(`${API_BASE_URL}/api/tags`);
        const tagsData: TagsResponse = await tagsResponse.json();
        const tags = tagsData.tags || [];

        const tagRoutes: MetadataRoute.Sitemap = tags.map((tag) => ({
            url: `${baseUrl}/tags/${tag.slug}`,
            lastModified: new Date(tag.updatedAt),
            changeFrequency: "weekly" as const,
            priority: 0.6,
        }));

        return [...staticRoutes, ...postRoutes, ...tagRoutes];
    } catch (error) {
        console.error("Error generating sitemap:", error);
        // Return static routes if API fails
        return staticRoutes;
    }
}
