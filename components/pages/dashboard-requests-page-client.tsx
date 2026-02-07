"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PublishRequestsList } from "@/components/publish-requests-list";
import { useMyPublishRequests } from "@/hooks/use-publish";

export function DashboardRequestsPageClient() {
    const [activeTab, setActiveTab] = useState("all");
    const { data } = useMyPublishRequests();

    const requests = data?.requests || [];
    const pendingCount = requests.filter((r) => r.status === "PENDING").length;
    const approvedCount = requests.filter((r) => r.status === "APPROVED").length;
    const rejectedCount = requests.filter((r) => r.status === "REJECTED").length;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold">Publish Requests</h1>
                <p className="text-muted-foreground">Track the status of your publish requests</p>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="all">All ({requests.length})</TabsTrigger>
                    <TabsTrigger value="PENDING">Pending ({pendingCount})</TabsTrigger>
                    <TabsTrigger value="APPROVED">Approved ({approvedCount})</TabsTrigger>
                    <TabsTrigger value="REJECTED">Rejected ({rejectedCount})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                    <PublishRequestsList filter="all" />
                </TabsContent>

                <TabsContent value="PENDING" className="mt-6">
                    <PublishRequestsList filter="PENDING" />
                </TabsContent>

                <TabsContent value="APPROVED" className="mt-6">
                    <PublishRequestsList filter="APPROVED" />
                </TabsContent>

                <TabsContent value="REJECTED" className="mt-6">
                    <PublishRequestsList filter="REJECTED" />
                </TabsContent>
            </Tabs>
        </div>
    );
}
