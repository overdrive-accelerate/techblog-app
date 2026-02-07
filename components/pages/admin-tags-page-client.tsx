"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminTagsTable } from "@/components/admin-tags-table";
import { TagFormDialog } from "@/components/tag-form-dialog";
import { useTags } from "@/hooks/use-tags";
import { Plus, Search } from "lucide-react";
import type { Tag } from "@/types/api";

export function AdminTagsPageClient() {
    const [search, setSearch] = useState("");
    const [formDialogOpen, setFormDialogOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);

    const { data, isLoading, refetch } = useTags();

    const filteredTags = useMemo(() => {
        const tags = data?.tags || [];
        if (!search) return tags;
        return tags.filter(
            (tag) =>
                tag.name.toLowerCase().includes(search.toLowerCase()) ||
                tag.slug.toLowerCase().includes(search.toLowerCase()) ||
                tag.description?.toLowerCase().includes(search.toLowerCase()),
        );
    }, [data?.tags, search]);

    const handleCreateClick = () => {
        setEditingTag(null);
        setFormDialogOpen(true);
    };

    const handleEditClick = (tag: Tag) => {
        setEditingTag(tag);
        setFormDialogOpen(true);
    };

    const handleDialogClose = (open: boolean) => {
        setFormDialogOpen(open);
        if (!open) {
            setEditingTag(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Tags</h1>
                    <p className="text-muted-foreground">Manage tags to organize your content</p>
                </div>
                <Button onClick={handleCreateClick}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Tag
                </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                    placeholder="Search tags..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Stats */}
            <div className="text-muted-foreground text-sm">
                {filteredTags.length} tag{filteredTags.length !== 1 ? "s" : ""} found
                {search && ` for "${search}"`}
            </div>

            {/* Tags Table */}
            <AdminTagsTable
                tags={filteredTags}
                isLoading={isLoading}
                onEdit={handleEditClick}
                onDeleted={() => refetch()}
            />

            {/* Create/Edit Dialog */}
            <TagFormDialog
                open={formDialogOpen}
                onOpenChange={handleDialogClose}
                tag={editingTag}
                onSuccess={() => refetch()}
            />
        </div>
    );
}
