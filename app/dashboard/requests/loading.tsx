import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardRequestsLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <Skeleton className="mb-2 h-10 w-48" />
                <Skeleton className="h-5 w-72" />
            </div>

            {/* Request Cards */}
            <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-lg border p-6">
                        <div className="mb-4 flex items-start justify-between">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                        <Skeleton className="mb-2 h-4 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                ))}
            </div>
        </div>
    );
}
