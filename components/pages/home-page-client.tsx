"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FeaturedPostsCarousel } from "@/components/featured-posts-carousel";
import { RecentPostsGrid } from "@/components/recent-posts-grid";
import { SearchBar } from "@/components/search-bar";
import { TagCloud } from "@/components/tag-cloud";
import { Button } from "@/components/ui/button";
import { usePosts } from "@/hooks/use-posts";
import { useTags } from "@/hooks/use-tags";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, BookOpen, Users, FileText, Sparkles } from "lucide-react";

export function HomePageClient() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [selectedTag, setSelectedTag] = useState<string | undefined>();
    const { isAuthenticated } = useAuth();

    // Fetch featured posts (recent 3 published posts)
    const { data: featuredData } = usePosts({
        limit: 3,
        sortBy: "publishedAt",
        sortOrder: "desc",
        status: "PUBLISHED",
    });

    // Fetch recent posts with filters
    const { data: postsData, isLoading: postsLoading } = usePosts({
        page,
        limit: 9,
        search: search || undefined,
        tagSlug: selectedTag,
        sortBy: "publishedAt",
        sortOrder: "desc",
        status: "PUBLISHED",
    });

    // Fetch tags
    const { data: tagsData, isLoading: tagsLoading } = useTags();

    const handleSearch = (query: string) => {
        setSearch(query);
        setPage(1); // Reset to first page on new search
    };

    const handleTagClick = (tagSlug: string) => {
        if (selectedTag === tagSlug) {
            setSelectedTag(undefined); // Deselect if clicking the same tag
        } else {
            setSelectedTag(tagSlug);
        }
        setPage(1); // Reset to first page on tag filter
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="bg-background min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="from-primary/5 via-primary/5 to-background relative overflow-hidden border-b bg-gradient-to-b">
                <div className="bg-grid-pattern absolute inset-0 opacity-5" />
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="bg-background/80 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm backdrop-blur">
                            <Sparkles className="text-primary h-4 w-4" />
                            <span>Your source for technical insights</span>
                        </div>
                        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                            Discover the Latest in{" "}
                            <span className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-transparent">
                                Tech & Development
                            </span>
                        </h1>
                        <p className="text-muted-foreground mb-8 text-lg md:text-xl">
                            Explore tutorials, best practices, and insights from developers around
                            the world. Stay ahead with cutting-edge technical content.
                        </p>
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Button size="lg" asChild>
                                <Link href="/posts">
                                    Browse Articles
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            {!isAuthenticated && (
                                <Button size="lg" variant="outline" asChild>
                                    <Link href="/signup">Join the Community</Link>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="flex justify-center">
                                <FileText className="text-primary h-8 w-8" />
                            </div>
                            <p className="mt-2 text-2xl font-bold">
                                {postsData?.pagination?.total || "50"}+
                            </p>
                            <p className="text-muted-foreground text-sm">Articles</p>
                        </div>
                        <div className="text-center">
                            <div className="flex justify-center">
                                <BookOpen className="text-primary h-8 w-8" />
                            </div>
                            <p className="mt-2 text-2xl font-bold">
                                {tagsData?.tags?.length || "10"}+
                            </p>
                            <p className="text-muted-foreground text-sm">Topics</p>
                        </div>
                        <div className="text-center">
                            <div className="flex justify-center">
                                <Users className="text-primary h-8 w-8" />
                            </div>
                            <p className="mt-2 text-2xl font-bold">1K+</p>
                            <p className="text-muted-foreground text-sm">Readers</p>
                        </div>
                    </div>
                </div>
            </section>

            <main className="container mx-auto px-4 py-12">
                {/* Hero Section with Featured Posts */}
                {featuredData?.posts && featuredData.posts.length > 0 && (
                    <section className="mb-16">
                        <FeaturedPostsCarousel posts={featuredData.posts} />
                    </section>
                )}

                {/* Search and Filter Section */}
                <section className="mb-12 space-y-6">
                    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
                        <div className="space-y-6">
                            <SearchBar onSearch={handleSearch} defaultValue={search} />

                            {/* Active Filters Display */}
                            {(search || selectedTag) && (
                                <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
                                    <span>Active filters:</span>
                                    {search && (
                                        <button
                                            onClick={() => handleSearch("")}
                                            className="bg-primary/10 text-primary hover:bg-primary/20 inline-flex items-center gap-1 rounded-full px-3 py-1 transition-colors"
                                        >
                                            Search: {search}
                                            <span className="ml-1">&times;</span>
                                        </button>
                                    )}
                                    {selectedTag && (
                                        <button
                                            onClick={() => setSelectedTag(undefined)}
                                            className="bg-primary/10 text-primary hover:bg-primary/20 inline-flex items-center gap-1 rounded-full px-3 py-1 transition-colors"
                                        >
                                            Tag:{" "}
                                            {
                                                tagsData?.tags.find((t) => t.slug === selectedTag)
                                                    ?.name
                                            }
                                            <span className="ml-1">&times;</span>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="lg:sticky lg:top-24 lg:self-start">
                            <div className="bg-card rounded-lg border p-4">
                                <TagCloud
                                    tags={tagsData?.tags || []}
                                    isLoading={tagsLoading}
                                    selectedTag={selectedTag}
                                    onTagClick={handleTagClick}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recent Posts Grid */}
                <section>
                    <RecentPostsGrid
                        posts={postsData?.posts || []}
                        isLoading={postsLoading}
                        pagination={postsData?.pagination}
                        onPageChange={handlePageChange}
                    />
                </section>
            </main>

            {/* Newsletter Section */}
            <section className="bg-muted/30 border-t">
                <div className="container mx-auto px-4 py-16">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl">
                            Stay Updated
                        </h2>
                        <p className="text-muted-foreground mb-8">
                            Get the latest articles and insights delivered directly to your inbox.
                            No spam, unsubscribe anytime.
                        </p>
                        <form
                            className="flex flex-col gap-3 sm:flex-row sm:justify-center"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-background placeholder:text-muted-foreground focus:ring-primary h-11 rounded-md border px-4 text-sm focus:ring-2 focus:outline-none sm:w-72"
                            />
                            <Button type="submit" size="lg">
                                Subscribe
                            </Button>
                        </form>
                        <p className="text-muted-foreground mt-4 text-xs">
                            By subscribing, you agree to our Privacy Policy.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
