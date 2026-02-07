"use client";

import { PostCard } from "@/components/post-card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePosts } from "@/hooks/use-posts";
import type { Post } from "@/types/api";

interface RelatedPostsProps {
    currentPost: Post;
}

export function RelatedPosts({ currentPost }: RelatedPostsProps) {
    // Get tag slugs from current post
    const tagSlugs = currentPost.tags.map((tag) => tag.slug);
    const primaryTag = tagSlugs[0]; // Use first tag for related posts

    // Fetch related posts by tag
    const { data, isLoading } = usePosts({
        tagSlug: primaryTag,
        limit: 3,
        status: "PUBLISHED",
        sortBy: "publishedAt",
        sortOrder: "desc",
    });

    // Filter out the current post
    const relatedPosts = data?.posts.filter((post) => post.id !== currentPost.id).slice(0, 3) || [];

    if (isLoading) {
        return (
            <section className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Related Posts</h2>
                <div className="grid gap-6 md:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-80 w-full" />
                    ))}
                </div>
            </section>
        );
    }

    if (!relatedPosts || relatedPosts.length === 0) {
        return null;
    }

    return (
        <section className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Related Posts</h2>
            <div className="grid gap-6 md:grid-cols-3">
                {relatedPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </section>
    );
}
