"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PublishRequestCard } from "@/components/publish-request-card";
import { useMyPublishRequests } from "@/hooks/use-publish";
import { FileText, PenSquare } from "lucide-react";

interface PublishRequestsListProps {
    filter?: "all" | "PENDING" | "APPROVED" | "REJECTED";
}

export function PublishRequestsList({ filter = "all" }: PublishRequestsListProps) {
    const { data, isLoading, refetch } = useMyPublishRequests();

    if (isLoading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-40 w-full" />
                ))}
            </div>
        );
    }

    const requests = data?.requests || [];
    const filteredRequests =
        filter === "all" ? requests : requests.filter((r) => r.status === filter);

    if (filteredRequests.length === 0) {
        return (
            <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-dashed">
                <div className="text-center">
                    <FileText className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                    <h3 className="text-lg font-semibold">No publish requests</h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                        {filter === "all"
                            ? "You haven't submitted any publish requests yet."
                            : `No ${filter.toLowerCase()} requests found.`}
                    </p>
                    <Button asChild>
                        <Link href="/dashboard/posts">
                            <PenSquare className="mr-2 h-4 w-4" />
                            View My Posts
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {filteredRequests.map((request) => (
                <PublishRequestCard
                    key={request.id}
                    request={request}
                    onCancelled={() => refetch()}
                />
            ))}
        </div>
    );
}
