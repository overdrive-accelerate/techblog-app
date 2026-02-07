"use client";

import { MyCommentsTable } from "@/components/my-comments-table";
import { useMyComments } from "@/hooks/use-comments";

export function DashboardCommentsPageClient() {
    const { data, isLoading, refetch } = useMyComments();

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold">My Comments</h1>
                <p className="text-muted-foreground">
                    View and manage all your comments across posts
                </p>
            </div>

            {/* Comments Table */}
            <MyCommentsTable
                comments={data?.comments || []}
                isLoading={isLoading}
                onUpdated={() => refetch()}
            />
        </div>
    );
}
