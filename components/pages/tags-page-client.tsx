"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tag as TagIcon } from "lucide-react";
import { useTags } from "@/hooks/use-tags";

export function TagsPageClient() {
    const { data, isLoading } = useTags();

    const tags = data?.tags || [];
    const sortedTags = [...tags].sort((a, b) => {
        const countA = a._count?.posts || 0;
        const countB = b._count?.posts || 0;
        return countB - countA;
    });

    return (
        <div className="bg-background min-h-screen">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="mb-2 text-4xl font-bold tracking-tight">All Tags</h1>
                    <p className="text-muted-foreground text-lg">Browse posts by topic</p>
                </div>

                {/* Tags Grid */}
                {isLoading ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <Skeleton key={i} className="h-32 w-full" />
                        ))}
                    </div>
                ) : tags.length === 0 ? (
                    <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold">No tags available</h3>
                            <p className="text-muted-foreground text-sm">
                                Tags will appear here once posts are published
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {sortedTags.map((tag) => {
                            const postCount = tag._count?.posts || 0;
                            return (
                                <Link key={tag.id} href={`/tags/${tag.slug}`} className="group">
                                    <div className="bg-card flex h-full flex-col rounded-lg border p-6 transition-all hover:shadow-lg">
                                        <div className="mb-3 flex items-center gap-3">
                                            <div className="bg-primary/10 group-hover:bg-primary/20 flex h-10 w-10 items-center justify-center rounded-lg transition-colors">
                                                <TagIcon className="text-primary h-5 w-5" />
                                            </div>
                                            <h3 className="group-hover:text-primary flex-1 text-lg font-semibold transition-colors">
                                                {tag.name}
                                            </h3>
                                        </div>
                                        {tag.description && (
                                            <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                                                {tag.description}
                                            </p>
                                        )}
                                        <div className="mt-auto">
                                            <Badge variant="secondary" className="text-xs">
                                                {postCount} {postCount === 1 ? "post" : "posts"}
                                            </Badge>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
