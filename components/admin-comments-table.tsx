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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteComment } from "@/hooks/use-comments";
import { formatDistanceToNow } from "@/lib/date-utils";
import { toast } from "sonner";
import { MoreHorizontal, Trash2, ExternalLink, Loader2, MessageSquare } from "lucide-react";
import type { CommentWithPost } from "@/types/api";

interface AdminCommentsTableProps {
    comments: CommentWithPost[];
    isLoading?: boolean;
    onDeleted?: () => void;
}

export function AdminCommentsTable({ comments, isLoading, onDeleted }: AdminCommentsTableProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState<CommentWithPost | null>(null);
    const deleteComment = useDeleteComment();

    const handleDeleteClick = (comment: CommentWithPost) => {
        setCommentToDelete(comment);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!commentToDelete) return;

        try {
            await deleteComment.mutateAsync({
                id: commentToDelete.id,
                postId: commentToDelete.postId,
            });
            toast.success("Comment deleted successfully");
            setDeleteDialogOpen(false);
            setCommentToDelete(null);
            onDeleted?.();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to delete comment";
            toast.error(message);
        }
    };

    const columns: ColumnDef<CommentWithPost>[] = [
        {
            accessorKey: "content",
            header: "Comment",
            cell: ({ row }) => {
                const comment = row.original;
                const truncatedContent =
                    comment.content.length > 100
                        ? comment.content.slice(0, 100) + "..."
                        : comment.content;

                return (
                    <div className="max-w-md">
                        <p className="text-sm">{truncatedContent}</p>
                    </div>
                );
            },
        },
        {
            accessorKey: "author",
            header: "Author",
            cell: ({ row }) => {
                const author = row.original.author;
                const initials = author.name
                    ? author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                    : "U";

                return (
                    <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                            <AvatarImage
                                src={author.image || undefined}
                                alt={author.name || "User"}
                            />
                            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{author.name || "Unknown"}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "post",
            header: "Post",
            cell: ({ row }) => {
                const post = row.original.post;
                return (
                    <div className="flex flex-col gap-1">
                        <Link
                            href={`/posts/${post.slug}`}
                            target="_blank"
                            className="line-clamp-1 text-sm font-medium hover:underline"
                        >
                            {post.title}
                        </Link>
                        <Badge
                            variant={post.status === "PUBLISHED" ? "default" : "secondary"}
                            className="w-fit text-xs"
                        >
                            {post.status}
                        </Badge>
                    </div>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: "Date",
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
                const comment = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={`/posts/${comment.post.slug}`} target="_blank">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    View Post
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => handleDeleteClick(comment)}
                                className="text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Comment
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data: comments,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
            </div>
        );
    }

    if (!comments || comments.length === 0) {
        return (
            <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-dashed">
                <div className="text-center">
                    <MessageSquare className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                    <h3 className="text-lg font-semibold">No comments found</h3>
                    <p className="text-muted-foreground text-sm">
                        Try adjusting your search or filters.
                    </p>
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
                        <DialogTitle>Delete Comment</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this comment? This action cannot be
                            undone.
                        </DialogDescription>
                    </DialogHeader>

                    {commentToDelete && (
                        <div className="bg-muted/50 rounded-lg border p-4">
                            <p className="text-sm">{commentToDelete.content}</p>
                            <p className="text-muted-foreground mt-2 text-xs">
                                By {commentToDelete.author.name || "Unknown"} on &quot;
                                {commentToDelete.post.title}&quot;
                            </p>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={deleteComment.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={deleteComment.isPending}
                        >
                            {deleteComment.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="mr-2 h-4 w-4" />
                            )}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
