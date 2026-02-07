"use client";

import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PostHeader } from "@/components/post-header";
import { MarkdownContent } from "@/components/markdown-content";
import { RelatedPosts } from "@/components/related-posts";
import { CommentsSection } from "@/components/comments-section";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { usePost } from "@/hooks/use-posts";
import Link from "next/link";

type PostDetailPageClientProps = {
    slug: string;
};

export function PostDetailPageClient({ slug }: PostDetailPageClientProps) {
    const router = useRouter();
    const { data: post, isLoading, error } = usePost(slug);

    // Note: View count is automatically incremented by the backend when fetching the post

    if (isLoading) {
        return (
            <div className="bg-background min-h-screen">
                <Navbar />
                <main className="container mx-auto max-w-4xl px-4 py-8">
                    <Skeleton className="mb-4 h-10 w-32" />
                    <div className="space-y-6">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-12 w-3/4" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-2/3" />
                    </div>
                </main>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="bg-background min-h-screen">
                <Navbar />
                <main className="container mx-auto max-w-4xl px-4 py-8">
                    <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                        <h1 className="mb-4 text-3xl font-bold">Post Not Found</h1>
                        <p className="text-muted-foreground mb-6">
                            The post you're looking for doesn't exist or has been removed.
                        </p>
                        <Button asChild>
                            <Link href="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen">
            <Navbar />

            <main className="container mx-auto max-w-4xl px-4 py-8">
                {/* Back Button */}
                <Button variant="ghost" size="sm" className="mb-6" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

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
