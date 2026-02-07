import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPostsLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <Skeleton className="mb-2 h-10 w-36" />
                    <Skeleton className="h-5 w-56" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            {/* Table */}
            <div className="rounded-lg border">
                {/* Table Header */}
                <div className="bg-muted/50 border-b p-4">
                    <div className="grid grid-cols-5 gap-4">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>

                {/* Table Rows */}
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="border-b p-4 last:border-b-0">
                        <div className="grid grid-cols-5 items-center gap-4">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-5 w-12" />
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-8 w-8 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
