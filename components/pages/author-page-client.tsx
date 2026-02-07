"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AuthorHeader } from "@/components/author-header";
import { SortDropdown, type SortOption } from "@/components/sort-dropdown";
import { PostsGrid } from "@/components/posts-grid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { usePosts } from "@/hooks/use-posts";
import Link from "next/link";

type AuthorPageClientProps = {
    authorId: string;
};

export function AuthorPageClient({ authorId }: AuthorPageClientProps) {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [currentSort, setCurrentSort] = useState("latest");
    const [sortBy, setSortBy] = useState<"createdAt" | "updatedAt" | "viewCount" | "publishedAt">(
        "publishedAt",
    );
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    // Fetch posts by this author
    const { data: postsData, isLoading: postsLoading } = usePosts({
        page,
        limit: 12,
        authorId: authorId,
        sortBy,
        sortOrder,
        status: "PUBLISHED",
    });

    const handleSortChange = (sort: SortOption) => {
        setCurrentSort(sort.value);
        setSortBy(sort.sortBy);
        setSortOrder(sort.sortOrder);
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Get author info from the first post (if available)
    const author = postsData?.posts[0]?.author;

    if (postsLoading && !author) {
        return (
            <div className="bg-background min-h-screen">
                <Navbar />
                <main className="container mx-auto max-w-6xl px-4 py-8">
                    <Skeleton className="mb-4 h-10 w-32" />
                    <Skeleton className="mb-8 h-48 w-full" />
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-96 w-full" />
                        ))}
                    </div>
                </main>
            </div>
        );
    }

    // If no posts found for this author, show error
    if (!postsLoading && !author) {
        return (
            <div className="bg-background min-h-screen">
                <Navbar />
                <main className="container mx-auto max-w-6xl px-4 py-8">
                    <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                        <h1 className="mb-4 text-3xl font-bold">Author Not Found</h1>
                        <p className="text-muted-foreground mb-6">
                            This author doesn't exist or hasn't published any posts yet.
                        </p>
                        <Button asChild>
                            <Link href="/posts">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Browse All Posts
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

            <main className="container mx-auto max-w-6xl px-4 py-8">
                {/* Back Button */}
                <Button variant="ghost" size="sm" className="mb-6" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                {/* Author Header */}
                {author && (
                    <div className="mb-8">
                        <AuthorHeader
                            author={author}
                            postCount={postsData?.pagination.total || 0}
                        />
                    </div>
                )}

                {/* Sort Options */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Published Posts</h2>
                    <SortDropdown currentSort={currentSort} onSortChange={handleSortChange} />
                </div>

                {/* Posts Grid */}
                <PostsGrid
                    posts={postsData?.posts || []}
                    isLoading={postsLoading}
                    pagination={postsData?.pagination}
                    onPageChange={handlePageChange}
                    emptyMessage={
                        author
                            ? `${author.name} hasn't published any posts yet. Check back later!`
                            : "No posts found for this author."
                    }
                />
            </main>

            <Footer />
        </div>
    );
}
