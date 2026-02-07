"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface AdminPostsFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    status: string;
    onStatusChange: (value: string) => void;
    onSearch: () => void;
    onClear: () => void;
}

export function AdminPostsFilters({
    search,
    onSearchChange,
    status,
    onStatusChange,
    onSearch,
    onClear,
}: AdminPostsFiltersProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch();
    };

    const hasFilters = search || status !== "all";

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                    placeholder="Search posts by title..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10"
                />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Select value={status} onValueChange={onStatusChange}>
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

                <div className="flex gap-2">
                    <Button type="submit" variant="secondary" className="flex-1 sm:flex-none">
                        <Search className="mr-2 h-4 w-4" />
                        Search
                    </Button>
                    {hasFilters && (
                        <Button type="button" variant="ghost" onClick={onClear} className="flex-1 sm:flex-none">
                            <X className="mr-2 h-4 w-4" />
                            Clear
                        </Button>
                    )}
                </div>
            </div>
        </form>
    );
}
