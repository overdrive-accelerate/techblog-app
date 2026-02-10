"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { api } from "@/lib/api-client";

const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const email = watch("email");

    const onSubmit = async (data: ForgotPasswordForm) => {
        setIsSubmitting(true);
        setError("");

        try {
            // Call Better-Auth forget-password endpoint
            await api.post("/api/auth/forget-password", {
                email: data.email,
                redirectTo: "/reset-password",
            });

            setIsSuccess(true);
        } catch {
            // Better-Auth doesn't expose whether email exists (security)
            // So we show success anyway to prevent email enumeration
            setIsSuccess(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex min-h-screen items-center justify-center px-4">
                <div className="w-full max-w-md text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                        <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="mb-2 text-2xl font-bold">Check Your Email</h1>
                    <p className="text-muted-foreground mb-6">
                        If an account exists for <strong>{email}</strong>, you will receive a
                        password reset link shortly.
                    </p>
                    <p className="text-muted-foreground mb-6 text-sm">
                        The link will expire in 1 hour for security reasons.
                    </p>
                    <Button asChild variant="outline">
                        <Link href="/login">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Login
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-3xl font-bold">Forgot Password?</h1>
                    <p className="text-muted-foreground">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                            <Mail className="text-muted-foreground absolute top-3 left-3 h-5 w-5" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                className="pl-10"
                                {...register("email")}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-destructive text-sm">{errors.email.message}</p>
                        )}
                    </div>

                    {error && (
                        <div className="bg-destructive/10 text-destructive rounded-md border border-red-200 p-3 text-sm dark:border-red-900">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Reset Link"}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <Link
                        href="/login"
                        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                        <ArrowLeft className="mr-1 inline h-4 w-4" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
