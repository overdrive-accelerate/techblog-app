import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PostHeader } from "@/components/post-header";
import { MarkdownContent } from "@/components/markdown-content";
import { RelatedPosts } from "@/components/related-posts";
import { CommentsSection } from "@/components/comments-section";
import { BackButton } from "@/components/back-button";
import { API_BASE_URL } from "@/lib/api-client";
import type { Post } from "@/types/api";

// Server-side data fetching with ISR caching
async function getPost(slug: string): Promise<Post | null> {
    try {
        // Use native fetch with Next.js cache options for ISR
        const response = await fetch(`${API_BASE_URL}/api/posts/${slug}`, {
            next: { revalidate: 3600 }, // ISR: Cache for 1 hour
        });

        if (!response.ok) {
            return null;
        }

        const post = await response.json();
        return post;
    } catch {
        return null;
    }
}

// Generate metadata for SEO
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        return {
            title: "Post Not Found",
        };
    }

    return {
        title: `${post.title} | Technical Blog`,
        description: post.excerpt || post.content.substring(0, 160),
        openGraph: {
            title: post.title,
            description: post.excerpt || post.content.substring(0, 160),
            type: "article",
            publishedTime: post.publishedAt || post.createdAt,
            modifiedTime: post.updatedAt,
            authors: [post.author.name],
            tags: post.tags.map((tag) => tag.name),
            images: post.coverImage
                ? [
                      {
                          url: post.coverImage,
                          width: 1200,
                          height: 630,
                          alt: post.title,
                      },
                  ]
                : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt || post.content.substring(0, 160),
            images: post.coverImage ? [post.coverImage] : undefined,
        },
    };
}

// Generate static params for popular posts at build time
// ISR: Revalidate every 1 hour (3600 seconds)
export const revalidate = 3600;

export async function generateStaticParams() {
    try {
        // Increased from 50 to 200 for better coverage
        const response = await fetch(`${API_BASE_URL}/api/posts?limit=200&status=PUBLISHED`, {
            next: { revalidate: 3600 }, // ISR: Revalidate cached data every hour
        });
        const data = await response.json();
        const posts = data.posts || [];

        return posts.map((post: Post) => ({
            slug: post.slug,
        }));
    } catch {
        // Return empty array if API is not available at build time
        return [];
    }
}

export default async function PostDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="bg-background min-h-screen">
            <Navbar />

            <main className="container mx-auto max-w-4xl px-4 py-8">
                {/* Back Button */}
                <BackButton />

                <article className="space-y-8">
                    {/* Post Header with author info */}
                    <PostHeader post={post} />

                    {/* Main Content */}
                    <MarkdownContent content={post.content} />
                </article>

                {/* Divider */}
                <hr className="my-12" />

                {/* Related Posts */}
                {post.tags.length > 0 && (
                    <div className="mb-12">
                        <RelatedPosts currentPost={post} />
                    </div>
                )}

                {/* Divider */}
                <hr className="my-12" />

                {/* Comments Section */}
                <CommentsSection postId={post.id} />
            </main>

            <Footer />
        </div>
    );
}
