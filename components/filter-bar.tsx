"use client";

import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";
import type { Tag } from "@/types/api";

interface FilterBarProps {
    search: string;
    selectedTag?: string;
    tags: Tag[];
    tagsLoading?: boolean;
    onSearchChange: (search: string) => void;
    onTagChange: (tag?: string) => void;
    onClearFilters: () => void;
}

export function FilterBar({
    search,
    selectedTag,
    tags,
    tagsLoading,
    onSearchChange,
    onTagChange,
    onClearFilters,
}: FilterBarProps) {
    const hasActiveFilters = search || selectedTag;
    const selectedTagName = tags.find((t) => t.slug === selectedTag)?.name;

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Search Bar */}
                <div className="flex-1">
                    <SearchBar onSearch={onSearchChange} defaultValue={search} />
                </div>

                {/* Filter Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                            <Filter className="h-4 w-4" />
                            Filters
                            {hasActiveFilters && (
                                <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1">
                                    {(search ? 1 : 0) + (selectedTag ? 1 : 0)}
                                </Badge>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Filter by Tag</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {tagsLoading ? (
                            <DropdownMenuItem disabled>Loading tags...</DropdownMenuItem>
                        ) : tags.length === 0 ? (
                            <DropdownMenuItem disabled>No tags available</DropdownMenuItem>
                        ) : (
                            <>
                                <DropdownMenuItem onClick={() => onTagChange(undefined)}>
                                    <span className={!selectedTag ? "font-semibold" : ""}>
                                        All Tags
                                    </span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {tags.map((tag) => (
                                    <DropdownMenuItem
                                        key={tag.id}
                                        onClick={() => onTagChange(tag.slug)}
                                        className="justify-between"
                                    >
                                        <span
                                            className={
                                                selectedTag === tag.slug ? "font-semibold" : ""
                                            }
                                        >
                                            {tag.name}
                                        </span>
                                        {tag._count?.posts && (
                                            <span className="text-muted-foreground text-xs">
                                                {tag._count.posts}
                                            </span>
                                        )}
                                    </DropdownMenuItem>
                                ))}
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-muted-foreground text-sm">Active filters:</span>
                    {search && (
                        <Badge variant="secondary" className="gap-1">
                            Search: {search}
                            <button
                                onClick={() => onSearchChange("")}
                                className="hover:text-destructive ml-1"
                                aria-label="Remove search filter"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                    {selectedTag && selectedTagName && (
                        <Badge variant="secondary" className="gap-1">
                            Tag: {selectedTagName}
                            <button
                                onClick={() => onTagChange(undefined)}
                                className="hover:text-destructive ml-1"
                                aria-label="Remove tag filter"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearFilters}
                        className="h-7 text-xs"
                    >
                        Clear all
                    </Button>
                </div>
            )}
        </div>
    );
}
