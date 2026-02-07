import { Skeleton } from "@/components/ui/skeleton";

export default function PostLoading() {
    return (
        <article className="container mx-auto max-w-4xl px-4 py-8">
            {/* Back button */}
            <Skeleton className="mb-6 h-9 w-24" />

            {/* Cover Image */}
            <Skeleton className="mb-8 h-64 w-full rounded-lg md:h-96" />

            {/* Title */}
            <Skeleton className="mb-4 h-10 w-full" />
            <Skeleton className="mb-6 h-10 w-3/4" />

            {/* Meta info */}
            <div className="mb-8 flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div>
                    <Skeleton className="mb-1 h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                </div>
            </div>

            {/* Tags */}
            <div className="mb-8 flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
            </div>

            {/* Content */}
            <div className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-11/12" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="mt-6 h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
            </div>

            {/* Comments Section */}
            <div className="mt-12 border-t pt-8">
                <Skeleton className="mb-6 h-8 w-32" />
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="rounded-lg border p-4">
                            <div className="mb-3 flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div>
                                    <Skeleton className="mb-1 h-4 w-24" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    ))}
                </div>
            </div>
        </article>
    );
}
