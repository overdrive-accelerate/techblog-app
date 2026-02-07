import { Skeleton } from "@/components/ui/skeleton";

export default function AdminTagsLoading() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="mb-2 h-10 w-28" />
                    <Skeleton className="h-5 w-48" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            {/* Search */}
            <Skeleton className="h-10 w-full sm:w-80" />

            {/* Table */}
            <div className="rounded-lg border">
                <div className="bg-muted/50 border-b p-4">
                    <div className="grid grid-cols-4 gap-4">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>

                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="border-b p-4 last:border-b-0">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-8 w-8 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
