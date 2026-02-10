import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PostNotFound() {
    return (
        <div className="bg-background min-h-screen">
            <Navbar />
            <main className="container mx-auto max-w-4xl px-4 py-8">
                <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                    <h1 className="mb-4 text-3xl font-bold">Post Not Found</h1>
                    <p className="text-muted-foreground mb-6">
                        The post you&apos;re looking for doesn&apos;t exist or has been removed.
                    </p>
                    <Button asChild>
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </main>
        </div>
    );
}
