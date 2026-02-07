import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPostsLoading() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Skeleton className="mb-2 h-10 w-36" />
                <Skeleton className="h-5 w-48" />
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-24" />
            </div>

            {/* Bulk Actions */}
            <Skeleton className="h-10 w-48" />

            {/* Table */}
            <div className="rounded-lg border">
                <div className="bg-muted/50 border-b p-4">
                    <div className="grid grid-cols-6 gap-4">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>

                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="border-b p-4 last:border-b-0">
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Skeleton className="h-4 w-4" />
                            <div>
                                <Skeleton className="mb-1 h-5 w-full" />
                                <Skeleton className="h-3 w-2/3" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-6 w-6 rounded-full" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-8 w-8 rounded" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-48" />
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-20" />
                </div>
            </div>
        </div>
    );
}
