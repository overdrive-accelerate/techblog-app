"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePosts } from "@/hooks/use-posts";
import { usePublishRequests } from "@/hooks/use-publish";
import { useUsers } from "@/hooks/use-users";
import { useAllComments } from "@/hooks/use-comments";
import {
    FileText,
    Clock,
    Tags,
    Users,
    MessageSquare,
    CheckCircle,
    XCircle,
    AlertCircle,
    TrendingUp,
    ArrowRight,
    Eye,
    Calendar,
} from "lucide-react";

export function AdminPageClient() {
    const { data: postsData, isLoading: postsLoading } = usePosts({
        limit: 5,
        sortBy: "createdAt",
        sortOrder: "desc",
    });
    const { data: requestsData, isLoading: requestsLoading } = usePublishRequests();
    const { data: usersData, isLoading: usersLoading } = useUsers({ limit: 5 });
    const { data: commentsData, isLoading: commentsLoading } = useAllComments({ limit: 1 });

    const requests = requestsData?.requests || [];
    const pendingRequests = requests.filter((r) => r.status === "PENDING");
    const approvedRequests = requests.filter((r) => r.status === "APPROVED");
    const rejectedRequests = requests.filter((r) => r.status === "REJECTED");

    const isLoading = postsLoading || requestsLoading || usersLoading || commentsLoading;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PUBLISHED":
                return <Badge className="bg-green-500 hover:bg-green-600">Published</Badge>;
            case "DRAFT":
                return <Badge variant="secondary">Draft</Badge>;
            case "PENDING":
                return <Badge className="bg-amber-500 hover:bg-amber-600">Pending</Badge>;
            case "REJECTED":
                return <Badge variant="destructive">Rejected</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Admin Overview</h1>
                    <p className="text-muted-foreground">
                        Welcome back! Here&apos;s what&apos;s happening on your platform.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/posts">
                            <FileText className="mr-2 h-4 w-4" />
                            All Posts
                        </Link>
                    </Button>
                    <Button size="sm" asChild>
                        <Link href="/admin/requests">
                            <Clock className="mr-2 h-4 w-4" />
                            Requests
                            {pendingRequests.length > 0 && (
                                <Badge variant="secondary" className="ml-2 bg-white/20">
                                    {pendingRequests.length}
                                </Badge>
                            )}
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Alert for Pending Requests */}
            {pendingRequests.length > 0 && (
                <div className="flex flex-col gap-4 rounded-xl border border-amber-500/50 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-4 sm:flex-row sm:items-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-amber-900 dark:text-amber-100">
                            {pendingRequests.length} pending publish request
                            {pendingRequests.length > 1 ? "s" : ""} awaiting review
                        </p>
                        <p className="text-muted-foreground text-sm">
                            Authors are waiting for your approval to publish their content
                        </p>
                    </div>
                    <Button asChild className="shrink-0 bg-amber-500 hover:bg-amber-600">
                        <Link href="/admin/requests">
                            Review Now
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                            <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <>
                                <div className="text-2xl font-bold">
                                    {postsData?.pagination.total || 0}
                                </div>
                                <p className="text-muted-foreground text-xs">
                                    Across all authors
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
                            <Clock className="h-5 w-5 text-amber-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <>
                                <div className="text-2xl font-bold">{pendingRequests.length}</div>
                                <p className="text-muted-foreground text-xs">
                                    Awaiting review
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
                            <Users className="h-5 w-5 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <>
                                <div className="text-2xl font-bold">
                                    {usersData?.pagination.total || 0}
                                </div>
                                <p className="text-muted-foreground text-xs">
                                    Registered accounts
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                            <MessageSquare className="h-5 w-5 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <>
                                <div className="text-2xl font-bold">
                                    {commentsData?.pagination?.total || 0}
                                </div>
                                <p className="text-muted-foreground text-xs">
                                    User interactions
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Request Status Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5" />
                        Request Overview
                    </CardTitle>
                    <CardDescription>Status breakdown of all publish requests</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="flex items-center gap-4 rounded-lg border p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
                                <Clock className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{pendingRequests.length}</p>
                                <p className="text-muted-foreground text-sm">Pending</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 rounded-lg border p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{approvedRequests.length}</p>
                                <p className="text-muted-foreground text-sm">Approved</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 rounded-lg border p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                                <XCircle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{rejectedRequests.length}</p>
                                <p className="text-muted-foreground text-sm">Rejected</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Posts */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Recent Posts</CardTitle>
                            <CardDescription>Latest content from authors</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/admin/posts">
                                View all
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div className="flex-1 space-y-1">
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : postsData?.posts && postsData.posts.length > 0 ? (
                            <div className="space-y-4">
                                {postsData.posts.slice(0, 4).map((post) => (
                                    <div key={post.id} className="flex items-start gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={post.author?.image || undefined} />
                                            <AvatarFallback>
                                                {post.author?.name?.[0] || "A"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/posts/${post.slug}`}
                                                    className="hover:text-primary truncate font-medium transition-colors"
                                                >
                                                    {post.title}
                                                </Link>
                                                {getStatusBadge(post.status)}
                                            </div>
                                            <div className="text-muted-foreground flex items-center gap-3 text-xs">
                                                <span>{post.author?.name}</span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(post.createdAt)}
                                                </span>
                                                {post.views !== undefined && (
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="h-3 w-3" />
                                                        {post.views}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground py-4 text-center text-sm">
                                No posts yet
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Users */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Recent Users</CardTitle>
                            <CardDescription>Newly registered accounts</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/admin/users">
                                View all
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div className="flex-1 space-y-1">
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : usersData?.users && usersData.users.length > 0 ? (
                            <div className="space-y-4">
                                {usersData.users.slice(0, 4).map((user) => (
                                    <div key={user.id} className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={user.image || undefined} />
                                            <AvatarFallback>
                                                {user.name?.[0] || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="truncate font-medium">
                                                    {user.name || "Unnamed"}
                                                </span>
                                                <Badge
                                                    variant={user.role === "ADMIN" ? "default" : "secondary"}
                                                    className={user.role === "ADMIN" ? "bg-amber-500 hover:bg-amber-600" : ""}
                                                >
                                                    {user.role}
                                                </Badge>
                                            </div>
                                            <p className="text-muted-foreground truncate text-xs">
                                                {user.email}
                                            </p>
                                        </div>
                                        <div className="text-muted-foreground text-right text-xs">
                                            <p>{user._count?.posts || 0} posts</p>
                                            <p>{user._count?.comments || 0} comments</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground py-4 text-center text-sm">
                                No users yet
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                    <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
                            <Link href="/admin/requests">
                                <Clock className="h-5 w-5 text-amber-600" />
                                <span className="text-xs sm:text-sm">Requests</span>
                            </Link>
                        </Button>
                        <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
                            <Link href="/admin/posts">
                                <FileText className="h-5 w-5 text-blue-600" />
                                <span className="text-xs sm:text-sm">All Posts</span>
                            </Link>
                        </Button>
                        <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
                            <Link href="/admin/tags">
                                <Tags className="h-5 w-5 text-green-600" />
                                <span className="text-xs sm:text-sm">Tags</span>
                            </Link>
                        </Button>
                        <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
                            <Link href="/admin/users">
                                <Users className="h-5 w-5 text-purple-600" />
                                <span className="text-xs sm:text-sm">Users</span>
                            </Link>
                        </Button>
                        <Button variant="outline" className="h-auto flex-col gap-2 py-4 col-span-2 sm:col-span-1" asChild>
                            <Link href="/admin/comments">
                                <MessageSquare className="h-5 w-5 text-pink-600" />
                                <span className="text-xs sm:text-sm">Comments</span>
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
