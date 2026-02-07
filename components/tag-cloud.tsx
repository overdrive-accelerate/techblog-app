"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Tag } from "@/types/api";

interface TagCloudProps {
    tags: Tag[];
    isLoading?: boolean;
    selectedTag?: string;
    onTagClick?: (slug: string) => void;
}

export function TagCloud({ tags, isLoading, selectedTag, onTagClick }: TagCloudProps) {
    if (isLoading) {
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-7 w-20" />
                    ))}
                </div>
            </div>
        );
    }

    if (!tags || tags.length === 0) {
        return null;
    }

    // Sort tags by post count (if available)
    const sortedTags = [...tags].sort((a, b) => {
        const countA = a._count?.posts || 0;
        const countB = b._count?.posts || 0;
        return countB - countA;
    });

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
                {sortedTags.map((tag) => {
                    const postCount = tag._count?.posts || 0;
                    const isSelected = selectedTag === tag.slug;

                    if (onTagClick) {
                        return (
                            <button
                                key={tag.id}
                                onClick={() => onTagClick(tag.slug)}
                                className="group inline-block"
                            >
                                <Badge
                                    variant={isSelected ? "default" : "secondary"}
                                    className="cursor-pointer transition-all hover:scale-105"
                                >
                                    {tag.name}
                                    {postCount > 0 && (
                                        <span className="ml-1 text-xs opacity-70">
                                            ({postCount})
                                        </span>
                                    )}
                                </Badge>
                            </button>
                        );
                    }

                    return (
                        <Link key={tag.id} href={`/tags/${tag.slug}`}>
                            <Badge
                                variant="secondary"
                                className="cursor-pointer transition-all hover:scale-105"
                            >
                                {tag.name}
                                {postCount > 0 && (
                                    <span className="ml-1 text-xs opacity-70">({postCount})</span>
                                )}
                            </Badge>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
