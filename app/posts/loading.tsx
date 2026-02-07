import { Skeleton } from "@/components/ui/skeleton";

export default function PostsLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <Skeleton className="mb-2 h-10 w-48" />
                <Skeleton className="h-5 w-72" />
            </div>

            {/* Search and Filters */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-32" />
            </div>

            {/* Posts Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="overflow-hidden rounded-lg border">
                        <Skeleton className="h-48 w-full" />
                        <div className="p-4">
                            <div className="mb-2 flex gap-2">
                                <Skeleton className="h-5 w-16 rounded-full" />
                                <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                            <Skeleton className="mb-2 h-6 w-full" />
                            <Skeleton className="mb-4 h-4 w-3/4" />
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
            </div>
        </div>
    );
}
