"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPageClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);

        try {
            const result = await signIn.email({
                email: data.email,
                password: data.password,
            });

            if (result.error) {
                toast.error(result.error.message || "Failed to sign in");
                return;
            }

            const redirectParam = searchParams.get("redirect");
            const redirectTo =
                redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//")
                    ? redirectParam
                    : "/";

            toast.success("Signed in successfully!");
            router.push(redirectTo);
            router.refresh();
        } catch (error) {
            toast.error("An unexpected error occurred");
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm space-y-6">
            {/* Header */}
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
                <p className="text-muted-foreground text-sm">
                    Enter your credentials to access your account
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                        <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            className="pl-10"
                            disabled={isLoading}
                            {...register("email")}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-destructive text-sm">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link
                            href="/forgot-password"
                            className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            className="pl-10"
                            disabled={isLoading}
                            {...register("password")}
                        />
                    </div>
                    {errors.password && (
                        <p className="text-destructive text-sm">{errors.password.message}</p>
                    )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        <>
                            Sign In
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </form>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background text-muted-foreground px-2">
                        New to TechBlog?
                    </span>
                </div>
            </div>

            {/* Sign up link */}
            <Button variant="outline" className="w-full" asChild>
                <Link href="/signup">Create an account</Link>
            </Button>
        </div>
    );
}
