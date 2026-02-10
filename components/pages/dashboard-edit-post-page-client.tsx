"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PostForm } from "@/components/post-form";
import { PostStatusBadge } from "@/components/post-status-badge";
import { usePostById } from "@/hooks/use-posts";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft } from "lucide-react";

type EditPostPageClientProps = {
    id: string;
};

export function EditPostPageClient({ id }: EditPostPageClientProps) {
    const { user, isAdmin } = useAuth();
    const { data: post, isLoading, error } = usePostById(id);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10" />
                    <div>
                        <Skeleton className="mb-2 h-8 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <h2 className="mb-2 text-xl font-semibold">Post not found</h2>
                    <p className="text-muted-foreground mb-4">
                        The post you're looking for doesn't exist or you don't have permission to
                        edit it.
                    </p>
                    <Button asChild>
                        <Link href="/dashboard/posts">Back to Posts</Link>
                    </Button>
                </div>
            </div>
        );
    }

    // Check ownership
    const isOwner = post.author.id === user?.id;
    if (!isOwner && !isAdmin) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <h2 className="mb-2 text-xl font-semibold">Access Denied</h2>
                    <p className="text-muted-foreground mb-4">
                        You don't have permission to edit this post.
                    </p>
                    <Button asChild>
                        <Link href="/dashboard/posts">Back to Posts</Link>
                    </Button>
                </div>
            </div>
        );
    }

    // Check if post can be edited
    const canEdit = post.status === "DRAFT" || post.status === "REJECTED" || isAdmin;
    if (!canEdit) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <h2 className="mb-2 text-xl font-semibold">Cannot Edit Post</h2>
                    <p className="text-muted-foreground mb-4">
                        This post is currently pending approval or published and cannot be edited.
                    </p>
                    <Button asChild>
                        <Link href="/dashboard/posts">Back to Posts</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/posts">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold">Edit Post</h1>
                        <PostStatusBadge status={post.status} />
                    </div>
                    <p className="text-muted-foreground">Make changes to your post</p>
                </div>
            </div>

            {/* Post Form */}
            <PostForm post={post} mode="edit" />
        </div>
    );
}
