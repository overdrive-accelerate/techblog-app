"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AdminUsersTable } from "@/components/admin-users-table";
import { useUsers } from "@/hooks/use-users";
import { Search, X, Shield, PenTool, User } from "lucide-react";

export function AdminUsersPageClient() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const { data, isLoading, refetch } = useUsers({
        page,
        limit: 20,
        search: search || undefined,
        role: roleFilter === "all" ? undefined : (roleFilter as "ADMIN" | "AUTHOR" | "READER"),
    });

    const handleSearch = () => {
        setSearch(searchInput);
        setPage(1);
    };

    const handleRoleChange = (value: string) => {
        setRoleFilter(value);
        setPage(1);
    };

    const handleClearFilters = () => {
        setSearch("");
        setSearchInput("");
        setRoleFilter("all");
        setPage(1);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch();
    };

    const hasFilters = search || roleFilter !== "all";

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold">Users</h1>
                <p className="text-muted-foreground">Manage user accounts and roles</p>
            </div>

            {/* Filters */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                        placeholder="Search by name or email..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <Select value={roleFilter} onValueChange={handleRoleChange}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="ADMIN">
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Admin
                            </div>
                        </SelectItem>
                        <SelectItem value="AUTHOR">
                            <div className="flex items-center gap-2">
                                <PenTool className="h-4 w-4" />
                                Author
                            </div>
                        </SelectItem>
                        <SelectItem value="READER">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Reader
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>

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
                    {data.pagination.total} user{data.pagination.total !== 1 ? "s" : ""} found
                    {search && ` for "${search}"`}
                    {roleFilter !== "all" && ` with role ${roleFilter}`}
                </div>
            )}

            {/* Users Table */}
            <AdminUsersTable
                users={data?.users || []}
                isLoading={isLoading}
                onRoleChanged={() => refetch()}
            />

            {/* Pagination */}
            {data && data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-sm">
                        Showing {(page - 1) * 20 + 1} to{" "}
                        {Math.min(page * 20, data.pagination.total)} of {data.pagination.total}{" "}
                        users
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
