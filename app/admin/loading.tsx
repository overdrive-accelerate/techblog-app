import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Skeleton className="mb-2 h-10 w-48" />
                <Skeleton className="h-5 w-72" />
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-lg border p-6">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-5 w-5" />
                        </div>
                        <Skeleton className="mt-2 h-8 w-16" />
                        <Skeleton className="mt-1 h-3 w-32" />
                    </div>
                ))}
            </div>

            {/* Alert */}
            <Skeleton className="h-16 w-full rounded-lg" />

            {/* Recent Activity */}
            <div className="rounded-lg border p-6">
                <Skeleton className="mb-4 h-6 w-40" />
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-4 flex-1" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
