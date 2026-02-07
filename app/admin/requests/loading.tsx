import { Skeleton } from "@/components/ui/skeleton";

export default function AdminRequestsLoading() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Skeleton className="mb-2 h-10 w-48" />
                <Skeleton className="h-5 w-64" />
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b pb-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
            </div>

            {/* Request Cards */}
            <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-lg border p-6">
                        <div className="mb-4 flex items-start justify-between">
                            <div className="flex-1">
                                <Skeleton className="mb-2 h-6 w-3/4" />
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-6 w-6 rounded-full" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                        <Skeleton className="mb-4 h-4 w-32" />
                        <div className="flex gap-2">
                            <Skeleton className="h-9 w-24" />
                            <Skeleton className="h-9 w-24" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
