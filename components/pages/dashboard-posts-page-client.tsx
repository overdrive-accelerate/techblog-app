"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MyPostsTable } from "@/components/my-posts-table";
import { useMyPosts } from "@/hooks/use-my-posts";
import { PlusCircle, Search } from "lucide-react";

export function MyPostsPageClient() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [searchInput, setSearchInput] = useState("");

    const { data, isLoading, refetch } = useMyPosts({
        page,
        limit: 10,
        search: search || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    };

    const handleStatusChange = (value: string) => {
        setStatusFilter(value);
        setPage(1);
    };

    const handleDeleted = () => {
        refetch();
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">My Posts</h1>
                    <p className="text-muted-foreground">Manage and track all your blog posts</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/posts/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Post
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row">
                <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                    <div className="relative flex-1">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                            placeholder="Search posts..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button type="submit" variant="secondary">
                        Search
                    </Button>
                </form>
                <Select value={statusFilter} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PENDING_APPROVAL">Pending</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Posts Table */}
            <MyPostsTable
                posts={data?.posts || []}
                isLoading={isLoading}
                onDeleted={handleDeleted}
            />

            {/* Pagination */}
            {data && data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-sm">
                        Showing {(page - 1) * 10 + 1} to{" "}
                        {Math.min(page * 10, data.pagination.total)} of {data.pagination.total}{" "}
                        posts
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
