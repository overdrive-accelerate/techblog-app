import { Skeleton } from "@/components/ui/skeleton";

export default function GlobalLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Hero Section Skeleton */}
            <div className="mb-12">
                <Skeleton className="mb-4 h-10 w-64" />
                <Skeleton className="h-6 w-96" />
            </div>

            {/* Content Grid Skeleton */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-lg border p-4">
                        <Skeleton className="mb-4 h-48 w-full rounded-lg" />
                        <Skeleton className="mb-2 h-6 w-3/4" />
                        <Skeleton className="mb-4 h-4 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ))}
            </div>
        </div>
    );
}
