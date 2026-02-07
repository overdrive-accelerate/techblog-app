"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchBarProps {
    onSearch: (query: string) => void;
    defaultValue?: string;
    placeholder?: string;
}

export function SearchBar({
    onSearch,
    defaultValue = "",
    placeholder = "Search posts...",
}: SearchBarProps) {
    const [query, setQuery] = useState(defaultValue);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
    };

    const handleClear = () => {
        setQuery("");
        onSearch("");
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full">
            <div className="relative flex items-center">
                <Search className="text-muted-foreground absolute left-3 h-4 w-4" />
                <Input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pr-20 pl-9"
                />
                <div className="absolute right-1 flex gap-1">
                    {query && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleClear}
                            className="h-7 px-2"
                            aria-label="Clear search"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    )}
                    <Button type="submit" size="sm" className="h-7">
                        Search
                    </Button>
                </div>
            </div>
        </form>
    );
}
