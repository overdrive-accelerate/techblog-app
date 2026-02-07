"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FilterBar } from "@/components/filter-bar";
import { SortDropdown, type SortOption } from "@/components/sort-dropdown";
import { PostsGrid } from "@/components/posts-grid";
import { usePosts } from "@/hooks/use-posts";
import { useTags } from "@/hooks/use-tags";

export function PostsListingPageClient() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [selectedTag, setSelectedTag] = useState<string | undefined>();
    const [currentSort, setCurrentSort] = useState("latest");
    const [sortBy, setSortBy] = useState<"createdAt" | "updatedAt" | "viewCount" | "publishedAt">(
        "publishedAt",
    );
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    // Fetch posts with filters
    const { data: postsData, isLoading: postsLoading } = usePosts({
        page,
        limit: 12,
        search: search || undefined,
        tagSlug: selectedTag,
        sortBy,
        sortOrder,
        status: "PUBLISHED",
    });

    // Fetch tags for filter
    const { data: tagsData, isLoading: tagsLoading } = useTags();

    const handleSearchChange = (query: string) => {
        setSearch(query);
        setPage(1); // Reset to first page
    };

    const handleTagChange = (tag?: string) => {
        setSelectedTag(tag);
        setPage(1); // Reset to first page
    };

    const handleSortChange = (sort: SortOption) => {
        setCurrentSort(sort.value);
        setSortBy(sort.sortBy);
        setSortOrder(sort.sortOrder);
        setPage(1); // Reset to first page
    };

    const handleClearFilters = () => {
        setSearch("");
        setSelectedTag(undefined);
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="bg-background min-h-screen">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="mb-2 text-4xl font-bold tracking-tight">All Posts</h1>
                    <p className="text-muted-foreground text-lg">
                        {postsData?.pagination.total || 0} posts available
                    </p>
                </div>

                {/* Filters and Sort */}
                <div className="mb-8 space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1">
                            <FilterBar
                                search={search}
                                selectedTag={selectedTag}
                                tags={tagsData?.tags || []}
                                tagsLoading={tagsLoading}
                                onSearchChange={handleSearchChange}
                                onTagChange={handleTagChange}
                                onClearFilters={handleClearFilters}
                            />
                        </div>
                        <SortDropdown currentSort={currentSort} onSortChange={handleSortChange} />
                    </div>
                </div>

                {/* Posts Grid */}
                <PostsGrid
                    posts={postsData?.posts || []}
                    isLoading={postsLoading}
                    pagination={postsData?.pagination}
                    onPageChange={handlePageChange}
                    emptyMessage={
                        search || selectedTag
                            ? "No posts match your filters. Try different criteria."
                            : "No posts available yet. Check back soon!"
                    }
                />
            </main>

            <Footer />
        </div>
    );
}
