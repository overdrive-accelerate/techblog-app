import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuthorLoading() {
    return (
        <div className="bg-background min-h-screen">
            <Navbar />

            <main className="container mx-auto max-w-6xl px-4 py-8">
                <Skeleton className="mb-6 h-10 w-32" />

                {/* Author Info Skeleton */}
                <div className="mb-12 flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
                    <Skeleton className="h-[120px] w-[120px] rounded-full" />

                    <div className="flex-1 space-y-3">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-96" />
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>

                {/* Articles Section */}
                <div>
                    <Skeleton className="mb-6 h-8 w-32" />

                    {/* Posts Grid Skeleton */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="rounded-lg border p-4">
                                <Skeleton className="mb-4 h-48 w-full rounded-lg" />
                                <Skeleton className="mb-2 h-6 w-full" />
                                <Skeleton className="mb-2 h-4 w-3/4" />
                                <div className="mt-4 flex gap-2">
                                    <Skeleton className="h-6 w-16 rounded-full" />
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
