import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PostsGrid } from "@/components/posts-grid";
import { BackButton } from "@/components/back-button";
import { api } from "@/lib/api-client";
import type { UserDetail, PostsResponse } from "@/types/api";

// Server-side data fetching
async function getAuthorData(id: string) {
    try {
        const [author, postsResponse] = await Promise.all([
            api.get<UserDetail>(`/api/users/${id}`),
            api.get<PostsResponse>(`/api/posts`, {
                params: { authorId: id, status: "PUBLISHED", limit: 100 },
            }),
        ]);
        return { author, posts: postsResponse.posts };
    } catch (error) {
        return null;
    }
}

// Generate metadata for SEO
export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const data = await getAuthorData(id);

    if (!data) {
        return {
            title: "Author Not Found",
        };
    }

    const { author, posts } = data;
    const postCount = posts.length;

    return {
        title: `${author.name || "Author"} | Technical Blog`,
        description:
            author.profile?.bio ||
            `Read ${postCount} articles by ${author.name || "this author"} on our technical blog.`,
        openGraph: {
            title: author.name || "Author",
            description:
                author.profile?.bio ||
                `Read ${postCount} articles by ${author.name || "this author"} on our technical blog.`,
            type: "profile",
            images: author.image ? [{ url: author.image }] : undefined,
        },
        twitter: {
            card: "summary",
            title: author.name || "Author",
            description:
                author.profile?.bio ||
                `Read ${postCount} articles by ${author.name || "this author"} on our technical blog.`,
            images: author.image ? [author.image] : undefined,
        },
    };
}

export default async function AuthorPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const data = await getAuthorData(id);

    if (!data) {
        notFound();
    }

    const { author, posts } = data;

    return (
        <div className="bg-background min-h-screen">
            <Navbar />

            <main className="container mx-auto max-w-6xl px-4 py-8">
                <BackButton />

                {/* Author Info */}
                <div className="mb-12 flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
                    {author.image ? (
                        <Image
                            src={author.image}
                            alt={author.name || "Author"}
                            width={120}
                            height={120}
                            className="rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500">
                            <span className="text-4xl font-bold text-white">
                                {author.name?.[0]?.toUpperCase() || "?"}
                            </span>
                        </div>
                    )}

                    <div className="flex-1">
                        <h1 className="mb-2 text-4xl font-bold">{author.name || "Anonymous"}</h1>
                        <p className="text-muted-foreground mb-2 text-sm uppercase tracking-wide">
                            {author.role}
                        </p>
                        {author.profile?.bio && (
                            <p className="text-muted-foreground mb-4 max-w-2xl">{author.profile.bio}</p>
                        )}
                        {author.profile?.website && (
                            <a
                                href={author.profile.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                {author.profile.website}
                            </a>
                        )}
                        <p className="text-muted-foreground mt-4">
                            {posts.length} {posts.length === 1 ? "article" : "articles"}
                        </p>
                    </div>
                </div>

                {/* Posts */}
                <div>
                    <h2 className="mb-6 text-2xl font-bold">Articles</h2>
                    {posts.length > 0 ? (
                        <PostsGrid posts={posts} />
                    ) : (
                        <div className="flex min-h-[300px] items-center justify-center">
                            <p className="text-muted-foreground text-lg">
                                No published posts yet.
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
