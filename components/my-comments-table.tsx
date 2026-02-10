"use client";

import { useState } from "react";
import Link from "next/link";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateComment, useDeleteComment } from "@/hooks/use-comments";
import { formatDistanceToNow } from "@/lib/date-utils";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Trash2, ExternalLink, Loader2, MessageSquare } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CommentWithPost } from "@/types/api";

interface MyCommentsTableProps {
    comments: CommentWithPost[];
    isLoading?: boolean;
    onUpdated?: () => void;
}

export function MyCommentsTable({ comments, isLoading, onUpdated }: MyCommentsTableProps) {
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedComment, setSelectedComment] = useState<CommentWithPost | null>(null);
    const [editContent, setEditContent] = useState("");

    const updateComment = useUpdateComment();
    const deleteComment = useDeleteComment();

    const handleEditClick = (comment: CommentWithPost) => {
        setSelectedComment(comment);
        setEditContent(comment.content);
        setEditDialogOpen(true);
    };

    const handleDeleteClick = (comment: CommentWithPost) => {
        setSelectedComment(comment);
        setDeleteDialogOpen(true);
    };

    const handleConfirmEdit = async () => {
        if (!selectedComment || !editContent.trim()) return;

        try {
            await updateComment.mutateAsync({
                id: selectedComment.id,
                content: editContent.trim(),
                postId: selectedComment.postId,
            });
            toast.success("Comment updated");
            setEditDialogOpen(false);
            setSelectedComment(null);
            onUpdated?.();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update comment");
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedComment) return;

        try {
            await deleteComment.mutateAsync({
                id: selectedComment.id,
                postId: selectedComment.postId,
            });
            toast.success("Comment deleted");
            setDeleteDialogOpen(false);
            setSelectedComment(null);
            onUpdated?.();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete comment");
        }
    };

    const columns: ColumnDef<CommentWithPost>[] = [
        {
            accessorKey: "content",
            header: "Comment",
            cell: ({ row }) => (
                <p className="line-clamp-2 max-w-md text-sm">{row.original.content}</p>
            ),
        },
        {
            accessorKey: "post",
            header: "Post",
            cell: ({ row }) => {
                const post = row.original.post;
                const isPublished = post.status === "PUBLISHED";
                return (
                    <div className="flex items-center gap-2">
                        {isPublished ? (
                            <Link
                                href={`/posts/${post.slug}`}
                                className="text-sm font-medium hover:underline"
                            >
                                {post.title}
                            </Link>
                        ) : (
                            <span className="text-muted-foreground text-sm">{post.title}</span>
                        )}
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
                const isPublished = comment.post.status === "PUBLISHED";

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {isPublished && (
                                <DropdownMenuItem asChild>
                                    <Link href={`/posts/${comment.post.slug}`} target="_blank">
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        View Post
                                    </Link>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleEditClick(comment)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => handleDeleteClick(comment)}
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
        data: comments,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                ))}
            </div>
        );
    }

    if (!comments || comments.length === 0) {
        return (
            <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-dashed">
                <div className="text-center">
                    <MessageSquare className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                    <h3 className="text-lg font-semibold">No comments yet</h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                        You haven't made any comments on posts
                    </p>
                    <Button asChild>
                        <Link href="/posts">Browse Posts</Link>
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

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Comment</DialogTitle>
                        <DialogDescription>
                            Update your comment on "{selectedComment?.post.title}"
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={4}
                        placeholder="Your comment..."
                    />
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEditDialogOpen(false)}
                            disabled={updateComment.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmEdit}
                            disabled={updateComment.isPending || !editContent.trim()}
                        >
                            {updateComment.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Pencil className="mr-2 h-4 w-4" />
                            )}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
