import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PostsGrid } from "@/components/posts-grid";
import { BackButton } from "@/components/back-button";
import { API_BASE_URL } from "@/lib/api-client";
import type { Tag, PostsResponse } from "@/types/api";

// ISR: Tags change rarely, revalidate every 24 hours
export const revalidate = 86400;

// Server-side data fetching with ISR caching
async function getTagData(slug: string) {
    try {
        const [tagResponse, postsResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/api/tags/${slug}`, {
                next: { revalidate: 86400 }, // Cache for 24 hours
            }),
            fetch(
                `${API_BASE_URL}/api/posts?tagSlug=${slug}&status=PUBLISHED&limit=100`,
                {
                    next: { revalidate: 86400 },
                },
            ),
        ]);

        if (!tagResponse.ok) {
            return null;
        }

        const tag = await tagResponse.json();
        const postsData: PostsResponse = await postsResponse.json();

        return { tag, posts: postsData.posts };
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
    const data = await getTagData(slug);

    if (!data) {
        return {
            title: "Tag Not Found",
        };
    }

    const { tag, posts } = data;
    const postCount = posts.length;

    return {
        title: `${tag.name} | Technical Blog`,
        description:
            tag.description || `Explore ${postCount} articles about ${tag.name} on our technical blog.`,
        openGraph: {
            title: tag.name,
            description:
                tag.description ||
                `Explore ${postCount} articles about ${tag.name} on our technical blog.`,
            type: "website",
        },
        twitter: {
            card: "summary",
            title: tag.name,
            description:
                tag.description ||
                `Explore ${postCount} articles about ${tag.name} on our technical blog.`,
        },
    };
}

// Generate static params for all tags at build time
export async function generateStaticParams() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/tags`, {
            next: { revalidate: 86400 }, // ISR: Revalidate daily
        });
        const data = await response.json();
        const tags = data.tags || [];

        return tags.map((tag: Tag) => ({
            slug: tag.slug,
        }));
    } catch {
        return [];
    }
}

export default async function TagPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const data = await getTagData(slug);

    if (!data) {
        notFound();
    }

    const { tag, posts } = data;

    return (
        <div className="bg-background min-h-screen">
            <Navbar />

            <main className="container mx-auto max-w-6xl px-4 py-8">
                <BackButton />

                <div className="mb-8">
                    <h1 className="mb-2 text-4xl font-bold">{tag.name}</h1>
                    {tag.description && (
                        <p className="text-muted-foreground text-lg">{tag.description}</p>
                    )}
                    <p className="text-muted-foreground mt-2 text-sm">
                        {posts.length} {posts.length === 1 ? "article" : "articles"}
                    </p>
                </div>

                {posts.length > 0 ? (
                    <PostsGrid posts={posts} />
                ) : (
                    <div className="flex min-h-[400px] items-center justify-center">
                        <p className="text-muted-foreground text-lg">
                            No published posts found with this tag.
                        </p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
