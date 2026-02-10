"use client";

import { useState } from "react";
import Link from "next/link";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { PostStatusBadge } from "@/components/post-status-badge";
import { useDeletePost } from "@/hooks/use-posts";
import { formatDistanceToNow } from "@/lib/date-utils";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Trash2, ExternalLink } from "lucide-react";
import type { Post } from "@/types/api";

interface MyPostsTableProps {
    posts: Post[];
    isLoading?: boolean;
    onDeleted?: () => void;
}

export function MyPostsTable({ posts, isLoading, onDeleted }: MyPostsTableProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<Post | null>(null);
    const deletePost = useDeletePost();

    const handleDeleteClick = (post: Post) => {
        setPostToDelete(post);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!postToDelete) return;

        try {
            await deletePost.mutateAsync(postToDelete.id);
            toast.success("Post deleted successfully");
            setDeleteDialogOpen(false);
            setPostToDelete(null);
            onDeleted?.();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete post");
        }
    };

    const columns: ColumnDef<Post>[] = [
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => {
                const post = row.original;
                return (
                    <div className="flex flex-col">
                        <span className="line-clamp-1 font-medium">{post.title}</span>
                        <span className="text-muted-foreground line-clamp-1 text-sm">
                            {post.excerpt || post.content.substring(0, 60) + "..."}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => <PostStatusBadge status={row.original.status} />,
        },
        {
            accessorKey: "views",
            header: "Views",
            cell: ({ row }) => (
                <span className="text-muted-foreground text-sm">{row.original.views}</span>
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Created",
            cell: ({ row }) => (
                <span className="text-muted-foreground text-sm">
                    {formatDistanceToNow(row.original.createdAt)}
                </span>
            ),
        },
        {
            id: "actions",
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }) => {
                const post = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {post.status === "PUBLISHED" && (
                                <DropdownMenuItem asChild>
                                    <Link href={`/posts/${post.slug}`} target="_blank">
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        View Live
                                    </Link>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem asChild>
                                <Link href={`/dashboard/posts/${post.id}/edit`}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => handleDeleteClick(post)}
                                className="text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data: posts,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                ))}
            </div>
        );
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-dashed">
                <div className="text-center">
                    <h3 className="text-lg font-semibold">No posts yet</h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                        Create your first post to get started
                    </p>
                    <Button asChild>
                        <Link href="/dashboard/posts/new">Create Post</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-muted/50">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Post</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{postToDelete?.title}"? This action
                            cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={deletePost.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={deletePost.isPending}
                        >
                            {deletePost.isPending ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
