import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <Skeleton className="mb-2 h-10 w-48" />
                <Skeleton className="h-5 w-64" />
            </div>

            {/* Stats Cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

            {/* Quick Links */}
            <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-lg border p-6">
                        <div className="mb-4 flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="mt-1 h-4 w-2/3" />
                    </div>
                ))}
            </div>
        </div>
    );
}
