"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log error to console in development
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
            <div className="text-center">
                <div className="bg-destructive/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
                    <AlertTriangle className="text-destructive h-10 w-10" />
                </div>

                <h1 className="mb-2 text-3xl font-bold">Something went wrong</h1>
                <p className="text-muted-foreground mb-6 max-w-md">
                    We encountered an unexpected error. Please try again or return to the homepage.
                </p>

                {error.digest && (
                    <p className="text-muted-foreground mb-6 text-xs">Error ID: {error.digest}</p>
                )}

                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                    <Button onClick={reset} variant="default">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Try Again
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
