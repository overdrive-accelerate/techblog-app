"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function TagError({ error, reset }: ErrorProps) {
    useEffect(() => {
        if (process.env.NODE_ENV === "development") {
            console.error("Tag page error:", error);
        }
    }, [error]);

    return (
        <div className="bg-background min-h-screen">
            <Navbar />

            <main className="container mx-auto max-w-6xl px-4 py-8">
                <div className="flex min-h-[400px] items-center justify-center">
                    <div className="text-center">
                        <div className="bg-destructive/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
                            <AlertTriangle className="text-destructive h-10 w-10" />
                        </div>

                        <h1 className="mb-2 text-3xl font-bold">Failed to load tag</h1>
                        <p className="text-muted-foreground mb-6 max-w-md">
                            We encountered an error while loading this tag page. Please try again.
                        </p>

                        {error.digest && (
                            <p className="text-muted-foreground mb-6 text-xs">
                                Error ID: {error.digest}
                            </p>
                        )}

                        <div className="flex flex-col justify-center gap-3 sm:flex-row">
                            <Button onClick={reset} variant="default">
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Try Again
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/tags">
                                    <Home className="mr-2 h-4 w-4" />
                                    All Tags
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
