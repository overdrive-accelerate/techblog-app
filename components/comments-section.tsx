"use client";

import { MessageCircle } from "lucide-react";
import { CommentForm } from "@/components/comment-form";
import { CommentList } from "@/components/comment-list";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useComments } from "@/hooks/use-comments";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CommentsSectionProps {
    postId: string;
}

export function CommentsSection({ postId }: CommentsSectionProps) {
    const { isAuthenticated } = useAuth();
    const { data, isLoading } = useComments(postId);

    const commentCount = data?.comments.length || 0;

    return (
        <section className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center gap-2">
                <MessageCircle className="h-6 w-6" />
                <h2 className="text-2xl font-bold tracking-tight">
                    Comments {commentCount > 0 && `(${commentCount})`}
                </h2>
            </div>

            {/* Comment Form - Only for authenticated users */}
            {isAuthenticated ? (
                <CommentForm postId={postId} />
            ) : (
                <div className="bg-muted/50 rounded-lg border border-dashed p-6 text-center">
                    <p className="text-muted-foreground mb-4">
                        You need to be signed in to comment
                    </p>
                    <div className="flex items-center justify-center gap-2">
                        <Button size="sm" asChild>
                            <Link href="/login">Sign In</Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                            <Link href="/signup">Sign Up</Link>
                        </Button>
                    </div>
                </div>
            )}

            {/* Comments List */}
            {isLoading ? (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full" />
                    ))}
                </div>
            ) : (
                <CommentList comments={data?.comments || []} postId={postId} />
            )}
        </section>
    );
}
