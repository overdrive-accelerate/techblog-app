"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useUpdateComment, useDeleteComment } from "@/hooks/use-comments";
import { formatDistanceToNow } from "@/lib/date-utils";
import { toast } from "sonner";
import type { Comment } from "@/types/api";

interface CommentListProps {
    comments: Comment[];
    postId: string;
}

export function CommentList({ comments, postId }: CommentListProps) {
    const { user, isAdmin } = useAuth();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");

    const updateComment = useUpdateComment();
    const deleteComment = useDeleteComment();

    if (comments.length === 0) {
        return (
            <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
            </div>
        );
    }

    const handleEdit = (comment: Comment) => {
        setEditingId(comment.id);
        setEditContent(comment.content);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditContent("");
    };

    const handleSaveEdit = async (commentId: string) => {
        if (!editContent.trim()) {
            toast.error("Comment cannot be empty");
            return;
        }

        try {
            await updateComment.mutateAsync({
                id: commentId,
                content: editContent,
                postId,
            });
            toast.success("Comment updated successfully!");
            setEditingId(null);
            setEditContent("");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update comment");
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm("Are you sure you want to delete this comment?")) {
            return;
        }

        try {
            await deleteComment.mutateAsync({ id: commentId, postId });
            toast.success("Comment deleted successfully!");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete comment");
        }
    };

    return (
        <div className="space-y-6">
            {comments.map((comment) => {
                const isOwner = user?.id === comment.author.id;
                const canModify = isOwner || isAdmin;
                const isEditing = editingId === comment.id;

                return (
                    <div key={comment.id} className="group relative rounded-lg border p-4">
                        {/* Comment Header */}
                        <div className="mb-3 flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage
                                        src={comment.author.image || undefined}
                                        alt={comment.author.name}
                                    />
                                    <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{comment.author.name}</p>
                                    <p className="text-muted-foreground text-xs">
                                        {formatDistanceToNow(comment.createdAt)}
                                        {comment.updatedAt !== comment.createdAt && " (edited)"}
                                    </p>
                                </div>
                            </div>

                            {/* Actions Menu */}
                            {canModify && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                                        >
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {isOwner && (
                                            <DropdownMenuItem onClick={() => handleEdit(comment)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem
                                            onClick={() => handleDelete(comment.id)}
                                            className="text-destructive"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>

                        {/* Comment Content */}
                        {isEditing ? (
                            <div className="space-y-3">
                                <Textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    rows={3}
                                />
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() => handleSaveEdit(comment.id)}
                                        disabled={updateComment.isPending}
                                    >
                                        {updateComment.isPending ? "Saving..." : "Save"}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleCancelEdit}
                                        disabled={updateComment.isPending}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-muted-foreground whitespace-pre-wrap">
                                {comment.content}
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
