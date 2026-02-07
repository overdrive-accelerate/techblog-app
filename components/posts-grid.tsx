"use client";

import { PostCard } from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Post } from "@/types/api";

interface PostsGridProps {
    posts: Post[];
    isLoading?: boolean;
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    onPageChange?: (page: number) => void;
    emptyMessage?: string;
}

export function PostsGrid({
    posts,
    isLoading,
    pagination,
    onPageChange,
    emptyMessage,
}: PostsGridProps) {
    if (isLoading) {
        return (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => (
                    <Skeleton key={i} className="h-96 w-full" />
                ))}
            </div>
        );
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed">
                <div className="text-center">
                    <h3 className="text-lg font-semibold">No posts found</h3>
                    <p className="text-muted-foreground text-sm">
                        {emptyMessage || "Try adjusting your filters or check back later"}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Posts Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange?.(pagination.page - 1)}
                            disabled={pagination.page === 1}
                        >
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            Previous
                        </Button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: pagination.totalPages }).map((_, i) => {
                                const page = i + 1;
                                // Show first, last, current, and pages around current
                                const shouldShow =
                                    page === 1 ||
                                    page === pagination.totalPages ||
                                    (page >= pagination.page - 1 && page <= pagination.page + 1);

                                if (!shouldShow) {
                                    // Show ellipsis once between groups
                                    if (
                                        page === pagination.page - 2 ||
                                        page === pagination.page + 2
                                    ) {
                                        return (
                                            <span key={page} className="text-muted-foreground px-2">
                                                ...
                                            </span>
                                        );
                                    }
                                    return null;
                                }

                                return (
                                    <Button
                                        key={page}
                                        variant={page === pagination.page ? "default" : "outline"}
                                        size="sm"
                                        className="min-w-9"
                                        onClick={() => onPageChange?.(page)}
                                    >
                                        {page}
                                    </Button>
                                );
                            })}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange?.(pagination.page + 1)}
                            disabled={pagination.page === pagination.totalPages}
                        >
                            Next
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>

                    {/* Results Info */}
                    <div className="text-muted-foreground text-sm">
                        Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                        {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                        {pagination.total} posts
                    </div>
                </div>
            )}
        </div>
    );
}
