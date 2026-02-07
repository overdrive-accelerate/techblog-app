"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, Check } from "lucide-react";

export type SortOption = {
    label: string;
    value: string;
    sortBy: "createdAt" | "updatedAt" | "viewCount" | "publishedAt";
    sortOrder: "asc" | "desc";
};

const sortOptions: SortOption[] = [
    { label: "Latest", value: "latest", sortBy: "publishedAt", sortOrder: "desc" },
    { label: "Oldest", value: "oldest", sortBy: "publishedAt", sortOrder: "asc" },
    { label: "Most Viewed", value: "most-viewed", sortBy: "viewCount", sortOrder: "desc" },
    {
        label: "Recently Updated",
        value: "recently-updated",
        sortBy: "updatedAt",
        sortOrder: "desc",
    },
];

interface SortDropdownProps {
    currentSort: string;
    onSortChange: (sort: SortOption) => void;
}

export function SortDropdown({ currentSort, onSortChange }: SortDropdownProps) {
    const currentOption = sortOptions.find((opt) => opt.value === currentSort) || sortOptions[0];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    Sort: {currentOption.label}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {sortOptions.map((option) => (
                    <DropdownMenuItem
                        key={option.value}
                        onClick={() => onSortChange(option)}
                        className="justify-between"
                    >
                        <span className={currentSort === option.value ? "font-semibold" : ""}>
                            {option.label}
                        </span>
                        {currentSort === option.value && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
