"use client";

import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTags } from "@/hooks/use-tags";
import { X, Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagMultiSelectProps {
    value: string[];
    onChange: (tags: string[]) => void;
    disabled?: boolean;
    maxTags?: number;
}

export function TagMultiSelect({
    value = [],
    onChange,
    disabled,
    maxTags = 5,
}: TagMultiSelectProps) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { data: tagsData } = useTags();

    const existingTags = tagsData?.tags || [];
    const filteredTags = existingTags.filter(
        (tag) =>
            tag.name.toLowerCase().includes(inputValue.toLowerCase()) && !value.includes(tag.name),
    );

    const canAddMore = value.length < maxTags;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (tagName: string) => {
        if (!canAddMore) return;
        const newValue = [...value, tagName];
        onChange(newValue);
        setInputValue("");
    };

    const handleRemove = (tagName: string) => {
        const newValue = value.filter((t) => t !== tagName);
        onChange(newValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue.trim() && canAddMore) {
            e.preventDefault();
            // Check if tag already exists in value
            if (!value.includes(inputValue.trim())) {
                handleSelect(inputValue.trim());
            }
        } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
            handleRemove(value[value.length - 1]);
        } else if (e.key === "Escape") {
            setOpen(false);
        }
    };

    return (
        <div className="space-y-2" ref={containerRef}>
            <Label>Tags</Label>
            <div
                className={cn(
                    "bg-background flex min-h-10 flex-wrap gap-2 rounded-md border px-3 py-2",
                    disabled && "cursor-not-allowed opacity-50",
                )}
                onClick={() => !disabled && inputRef.current?.focus()}
            >
                {value.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemove(tag);
                            }}
                            disabled={disabled}
                            className="hover:bg-muted-foreground/20 ml-1 rounded-full outline-none"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
                {canAddMore && (
                    <Input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            setOpen(true);
                        }}
                        onFocus={() => setOpen(true)}
                        onKeyDown={handleKeyDown}
                        placeholder={value.length === 0 ? "Add tags..." : ""}
                        disabled={disabled}
                        className="h-7 flex-1 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
                    />
                )}
            </div>

            {/* Dropdown */}
            {open && (filteredTags.length > 0 || inputValue.trim()) && (
                <div className="relative">
                    <div className="bg-popover absolute z-10 w-full rounded-md border shadow-md">
                        <div className="max-h-[200px] overflow-y-auto p-1">
                            {filteredTags.map((tag) => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => handleSelect(tag.name)}
                                    disabled={!canAddMore}
                                    className={cn(
                                        "flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none",
                                        "hover:bg-accent hover:text-accent-foreground",
                                        !canAddMore && "cursor-not-allowed opacity-50",
                                    )}
                                >
                                    <span>{tag.name}</span>
                                    {tag._count?.posts !== undefined && (
                                        <span className="text-muted-foreground text-xs">
                                            {tag._count.posts} posts
                                        </span>
                                    )}
                                </button>
                            ))}

                            {/* Option to create new tag */}
                            {inputValue.trim() &&
                                !existingTags.some(
                                    (t) => t.name.toLowerCase() === inputValue.toLowerCase(),
                                ) &&
                                !value.includes(inputValue.trim()) && (
                                    <button
                                        type="button"
                                        onClick={() => handleSelect(inputValue.trim())}
                                        disabled={!canAddMore}
                                        className={cn(
                                            "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
                                            "hover:bg-accent hover:text-accent-foreground",
                                            !canAddMore && "cursor-not-allowed opacity-50",
                                        )}
                                    >
                                        <Plus className="h-3 w-3" />
                                        Create "{inputValue.trim()}"
                                    </button>
                                )}
                        </div>
                    </div>
                </div>
            )}

            <p className="text-muted-foreground text-xs">
                {value.length}/{maxTags} tags selected. Press Enter to add a new tag.
            </p>
        </div>
    );
}
