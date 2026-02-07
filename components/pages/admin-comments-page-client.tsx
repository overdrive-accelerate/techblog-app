"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminCommentsTable } from "@/components/admin-comments-table";
import { useAllComments } from "@/hooks/use-comments";
import { Search, X } from "lucide-react";

export function AdminCommentsPageClient() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");

    const { data, isLoading, refetch } = useAllComments({
        page,
        limit: 20,
        search: search || undefined,
    });

    const handleSearch = () => {
        setSearch(searchInput);
        setPage(1);
    };

    const handleClearFilters = () => {
        setSearch("");
        setSearchInput("");
        setPage(1);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch();
    };

    const hasFilters = !!search;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold">Comments</h1>
                <p className="text-muted-foreground">Moderate comments across all posts</p>
            </div>

            {/* Filters */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                        placeholder="Search comments..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <div className="flex gap-2">
                    <Button type="submit" variant="secondary">
                        Search
                    </Button>
                    {hasFilters && (
                        <Button type="button" variant="ghost" onClick={handleClearFilters}>
                            <X className="mr-2 h-4 w-4" />
                            Clear
                        </Button>
                    )}
                </div>
            </form>

            {/* Stats */}
            {data && (
                <div className="text-muted-foreground text-sm">
                    {data.pagination.total} comment{data.pagination.total !== 1 ? "s" : ""} found
                    {search && ` for "${search}"`}
                </div>
            )}

            {/* Comments Table */}
            <AdminCommentsTable
                comments={data?.comments || []}
                isLoading={isLoading}
                onDeleted={() => refetch()}
            />

            {/* Pagination */}
            {data && data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-sm">
                        Showing {(page - 1) * 20 + 1} to{" "}
                        {Math.min(page * 20, data.pagination.total)} of {data.pagination.total}{" "}
                        comments
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(page - 1)}
                            disabled={page <= 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(page + 1)}
                            disabled={page >= data.pagination.totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
