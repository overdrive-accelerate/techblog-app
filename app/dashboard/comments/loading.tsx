import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardCommentsLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <Skeleton className="mb-2 h-10 w-40" />
                <Skeleton className="h-5 w-64" />
            </div>

            {/* Table */}
            <div className="rounded-lg border">
                <div className="bg-muted/50 border-b p-4">
                    <div className="grid grid-cols-4 gap-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>

                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="border-b p-4 last:border-b-0">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Skeleton className="h-5 w-full" />
                            <div>
                                <Skeleton className="mb-1 h-4 w-full" />
                                <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-8 w-8 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
