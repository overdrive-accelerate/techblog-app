import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
            <div className="text-center">
                <div className="bg-muted mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
                    <FileQuestion className="text-muted-foreground h-10 w-10" />
                </div>

                <h1 className="mb-2 text-6xl font-bold">404</h1>
                <h2 className="mb-2 text-2xl font-semibold">Page Not Found</h2>
                <p className="text-muted-foreground mb-8 max-w-md">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved. Check the
                    URL or navigate back to safety.
                </p>

                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                    <Button asChild variant="default">
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/posts">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Browse Posts
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
