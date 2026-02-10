"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, CheckCircle, XCircle } from "lucide-react";
import { api } from "@/lib/api-client";

const resetPasswordSchema = z
    .object({
        newPassword: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const token = searchParams.get("token");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordForm) => {
        if (!token) {
            setError("Reset token is missing. Please check your email link.");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            // Call Better-Auth reset-password endpoint
            await api.post("/api/auth/reset-password", {
                newPassword: data.newPassword,
                token,
            });

            setIsSuccess(true);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to reset password. The link may have expired or is invalid.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show error if no token
    if (!token && !isSuccess) {
        return (
            <div className="flex min-h-screen items-center justify-center px-4">
                <div className="w-full max-w-md text-center">
                    <div className="bg-destructive/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
                        <XCircle className="text-destructive h-10 w-10" />
                    </div>
                    <h1 className="mb-2 text-2xl font-bold">Invalid Reset Link</h1>
                    <p className="text-muted-foreground mb-6">
                        The password reset link is invalid or missing. Please request a new reset
                        link.
                    </p>
                    <Button asChild>
                        <Link href="/forgot-password">Request New Link</Link>
                    </Button>
                </div>
            </div>
        );
    }

    // Show success message
    if (isSuccess) {
        return (
            <div className="flex min-h-screen items-center justify-center px-4">
                <div className="w-full max-w-md text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                        <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="mb-2 text-2xl font-bold">Password Reset Successful!</h1>
                    <p className="text-muted-foreground mb-6">
                        Your password has been successfully reset. You can now log in with your new
                        password.
                    </p>
                    <Button asChild>
                        <Link href="/login">Go to Login</Link>
                    </Button>
                </div>
            </div>
        );
    }

    // Show reset password form
    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-3xl font-bold">Reset Your Password</h1>
                    <p className="text-muted-foreground">
                        Enter your new password below. Make sure it's at least 8 characters long.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                            <Lock className="text-muted-foreground absolute top-3 left-3 h-5 w-5" />
                            <Input
                                id="newPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                className="pr-10 pl-10"
                                {...register("newPassword")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-muted-foreground hover:text-foreground absolute top-3 right-3"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="text-destructive text-sm">{errors.newPassword.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                            <Lock className="text-muted-foreground absolute top-3 left-3 h-5 w-5" />
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm new password"
                                className="pr-10 pl-10"
                                {...register("confirmPassword")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="text-muted-foreground hover:text-foreground absolute top-3 right-3"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-destructive text-sm">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {error && (
                        <div className="bg-destructive/10 text-destructive rounded-md border border-red-200 p-3 text-sm dark:border-red-900">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Resetting Password..." : "Reset Password"}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <Link
                        href="/login"
                        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                        Remember your password? Log in
                    </Link>
                </div>
            </div>
        </div>
    );
}
