"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PostForm } from "@/components/post-form";
import { ArrowLeft } from "lucide-react";

export function NewPostPageClient() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/posts">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Create New Post</h1>
                    <p className="text-muted-foreground">
                        Write your post in Markdown and save as draft
                    </p>
                </div>
            </div>

            {/* Post Form */}
            <PostForm mode="create" />
        </div>
    );
}
