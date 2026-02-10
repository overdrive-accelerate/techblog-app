"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Shield, ShieldAlert } from "lucide-react";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isLoading, isAuthenticated, isAdmin } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="bg-background min-h-screen">
                <Navbar />
                <div className="flex h-[calc(100vh-4rem)]">
                    <div className="bg-card hidden w-64 border-r p-4 lg:block">
                        <Skeleton className="mb-4 h-8 w-32" />
                        <div className="space-y-2">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full rounded-lg" />
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 p-6 lg:p-8">
                        <Skeleton className="mb-4 h-10 w-48" />
                        <Skeleton className="h-64 w-full rounded-lg" />
                    </div>
                </div>
            </div>
        );
    }

    // Redirect if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    // Show access denied if not admin
    if (!isAdmin) {
        return (
            <div className="bg-background min-h-screen">
                <Navbar />
                <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
                    <div className="text-center">
                        <div className="bg-destructive/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                            <ShieldAlert className="text-destructive h-8 w-8" />
                        </div>
                        <h1 className="mb-2 text-2xl font-bold">Access Denied</h1>
                        <p className="text-muted-foreground mb-4">
                            You need administrator privileges to access this area.
                        </p>
                        <Button asChild>
                            <Link href="/">Return Home</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background flex min-h-screen flex-col">
            <Navbar />
            <div className="flex flex-1">
                {/* Desktop Sidebar */}
                <AdminSidebar />

                {/* Main Content */}
                <main className="flex-1">
                    {/* Mobile Header */}
                    <div className="bg-card/50 sticky top-0 z-10 flex items-center justify-between border-b p-4 backdrop-blur lg:hidden">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white">
                                <Shield className="h-4 w-4" />
                            </div>
                            <span className="font-semibold">Admin Panel</span>
                        </div>
                        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-72 p-0">
                                <SheetHeader className="border-b p-4">
                                    <SheetTitle className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white">
                                            <Shield className="h-4 w-4" />
                                        </div>
                                        Admin Panel
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex h-[calc(100%-5rem)] flex-col">
                                    <AdminSidebar mobile onNavigate={() => setMobileOpen(false)} />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Page Content */}
                    <div className="p-4 lg:p-8">{children}</div>
                </main>
            </div>
        </div>
    );
}
