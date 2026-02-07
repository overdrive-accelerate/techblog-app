"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isAuthenticated, isLoading, isAuthor } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login?redirect=/dashboard");
        }
    }, [isLoading, isAuthenticated, router]);

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <div className="bg-background min-h-screen">
                <Navbar />
                <div className="flex">
                    <div className="w-64 border-r p-4">
                        <Skeleton className="mb-4 h-8 w-32" />
                        <div className="space-y-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full" />
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 p-8">
                        <Skeleton className="mb-4 h-10 w-48" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    // Redirect if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    // Show access denied if not an author or admin
    if (!isAuthor) {
        return (
            <div className="bg-background min-h-screen">
                <Navbar />
                <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
                    <h1 className="mb-4 text-3xl font-bold">Access Denied</h1>
                    <p className="text-muted-foreground mb-6">
                        You need to be an Author or Admin to access the dashboard.
                    </p>
                    <p className="text-muted-foreground text-sm">
                        Contact an administrator to upgrade your account.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background flex min-h-screen flex-col">
            <Navbar />
            <div className="flex flex-1">
                <DashboardSidebar />
                <main className="flex-1 p-8">{children}</main>
            </div>
        </div>
    );
}
