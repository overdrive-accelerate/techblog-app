"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyPosts } from "@/hooks/use-my-posts";
import { useMyPublishRequests } from "@/hooks/use-publish";
import { useMyComments } from "@/hooks/use-comments";
import { FileText, Clock, MessageSquare, PenSquare, CheckCircle } from "lucide-react";

export function DashboardPageClient() {
    const { data: postsData, isLoading: postsLoading } = useMyPosts({ limit: 5 });
    const { data: requestsData, isLoading: requestsLoading } = useMyPublishRequests();
    const { data: commentsData, isLoading: commentsLoading } = useMyComments();

    const posts = postsData?.posts || [];
    const requests = requestsData?.requests || [];
    const comments = commentsData?.comments || [];

    const draftCount = posts.filter((p) => p.status === "DRAFT").length;
    const publishedCount = posts.filter((p) => p.status === "PUBLISHED").length;
    const pendingRequestsCount = requests.filter((r) => r.status === "PENDING").length;

    const isLoading = postsLoading || requestsLoading || commentsLoading;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back! Here's an overview of your content.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/posts/new">
                        <PenSquare className="mr-2 h-4 w-4" />
                        New Post
                    </Link>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                        <FileText className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold">
                                {postsData?.pagination.total || 0}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Published</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold">{publishedCount}</div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold">{pendingRequestsCount}</div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Comments</CardTitle>
                        <MessageSquare className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold">{comments.length}</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Links */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            My Posts
                        </CardTitle>
                        <CardDescription>Manage your blog posts</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Drafts</span>
                                <span className="font-medium">{draftCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Published</span>
                                <span className="font-medium">{publishedCount}</span>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/dashboard/posts">View All Posts</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Publish Requests
                        </CardTitle>
                        <CardDescription>Track your publish requests</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Pending</span>
                                <span className="font-medium">{pendingRequestsCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Requests</span>
                                <span className="font-medium">{requests.length}</span>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/dashboard/requests">View Requests</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            My Comments
                        </CardTitle>
                        <CardDescription>Manage your comments</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Comments</span>
                                <span className="font-medium">{comments.length}</span>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/dashboard/comments">View Comments</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
