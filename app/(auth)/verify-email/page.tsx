"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Home } from "lucide-react";
import { api } from "@/lib/api-client";

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get("token");

            if (!token) {
                setStatus("error");
                setErrorMessage("Verification token is missing. Please check your email link.");
                return;
            }

            try {
                // Call Better-Auth verify-email endpoint
                await api.get(`/api/auth/verify-email`, {
                    params: { token },
                });

                setStatus("success");

                // Redirect to home page after 3 seconds
                setTimeout(() => {
                    router.push("/");
                }, 3000);
            } catch (error) {
                setStatus("error");
                setErrorMessage(
                    error instanceof Error
                        ? error.message
                        : "Failed to verify email. The link may have expired or is invalid.",
                );
            }
        };

        verifyEmail();
    }, [searchParams, router]);

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-md text-center">
                {status === "loading" && (
                    <>
                        <Loader2 className="text-primary mx-auto mb-6 h-16 w-16 animate-spin" />
                        <h1 className="mb-2 text-2xl font-bold">Verifying Your Email</h1>
                        <p className="text-muted-foreground">
                            Please wait while we verify your email address...
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                        </div>
                        <h1 className="mb-2 text-2xl font-bold">Email Verified!</h1>
                        <p className="text-muted-foreground mb-6">
                            Your email has been successfully verified. You're now logged in and will
                            be redirected to the homepage shortly.
                        </p>
                        <Button asChild>
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                Go to Home
                            </Link>
                        </Button>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="bg-destructive/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
                            <XCircle className="text-destructive h-10 w-10" />
                        </div>
                        <h1 className="mb-2 text-2xl font-bold">Verification Failed</h1>
                        <p className="text-muted-foreground mb-6">{errorMessage}</p>
                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Button asChild variant="default">
                                <Link href="/signup">Try Signing Up Again</Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/">
                                    <Home className="mr-2 h-4 w-4" />
                                    Go to Home
                                </Link>
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
