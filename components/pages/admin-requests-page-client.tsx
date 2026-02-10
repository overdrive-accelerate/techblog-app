"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminPublishRequestsList } from "@/components/admin-publish-requests-list";
import { usePublishRequests } from "@/hooks/use-publish";
import { cn } from "@/lib/utils";
import { ArrowLeft, Clock, CheckCircle, XCircle, Inbox } from "lucide-react";

type FilterType = "PENDING" | "APPROVED" | "REJECTED" | "all";

export function AdminRequestsPageClient() {
    const [activeTab, setActiveTab] = useState<FilterType>("PENDING");
    const { data } = usePublishRequests();

    const requests = data?.requests || [];
    const pendingCount = requests.filter((r) => r.status === "PENDING").length;
    const approvedCount = requests.filter((r) => r.status === "APPROVED").length;
    const rejectedCount = requests.filter((r) => r.status === "REJECTED").length;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="shrink-0">
                        <Link href="/admin">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                Publish Requests
                            </h1>
                            {pendingCount > 0 && (
                                <Badge className="bg-amber-500 hover:bg-amber-600">
                                    {pendingCount} pending
                                </Badge>
                            )}
                        </div>
                        <p className="text-muted-foreground">
                            Review and manage author publish requests
                        </p>
                    </div>
                </div>
            </div>

            {/* Status Filter Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <button
                    onClick={() => setActiveTab("PENDING")}
                    className={cn(
                        "flex items-center gap-3 rounded-lg border p-4 text-left transition-colors",
                        activeTab === "PENDING"
                            ? "border-amber-500 bg-amber-500/5"
                            : "hover:bg-muted/50",
                    )}
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
                        <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{pendingCount}</p>
                        <p className="text-muted-foreground text-sm">Pending</p>
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab("APPROVED")}
                    className={cn(
                        "flex items-center gap-3 rounded-lg border p-4 text-left transition-colors",
                        activeTab === "APPROVED"
                            ? "border-green-500 bg-green-500/5"
                            : "hover:bg-muted/50",
                    )}
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{approvedCount}</p>
                        <p className="text-muted-foreground text-sm">Approved</p>
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab("REJECTED")}
                    className={cn(
                        "flex items-center gap-3 rounded-lg border p-4 text-left transition-colors",
                        activeTab === "REJECTED"
                            ? "border-red-500 bg-red-500/5"
                            : "hover:bg-muted/50",
                    )}
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                        <XCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{rejectedCount}</p>
                        <p className="text-muted-foreground text-sm">Rejected</p>
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab("all")}
                    className={cn(
                        "flex items-center gap-3 rounded-lg border p-4 text-left transition-colors",
                        activeTab === "all" ? "border-blue-500 bg-blue-500/5" : "hover:bg-muted/50",
                    )}
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                        <Inbox className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{requests.length}</p>
                        <p className="text-muted-foreground text-sm">All Requests</p>
                    </div>
                </button>
            </div>

            {/* Request List */}
            <AdminPublishRequestsList filter={activeTab} />
        </div>
    );
}
