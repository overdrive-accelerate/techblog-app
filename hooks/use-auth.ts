"use client";

import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import type { Role } from "@/types/auth";

// Extended user type that includes custom fields from Better Auth config
interface ExtendedUser {
    id: string;
    email: string;
    name: string;
    image?: string | null;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    role?: Role;
}

export function useAuth() {
    const { data: session, isPending, error } = useSession();
    const hasSessionError = !!error;

    useEffect(() => {
        if (error) {
            console.warn("Session lookup failed:", error);
        }
    }, [error]);

    // Cast to extended user type that includes our custom role field
    const user = session?.user as ExtendedUser | undefined;
    const isAuthenticated = !!user;
    const role = user?.role;

    const hasRole = (requiredRole: Role | Role[]): boolean => {
        if (!role) return false;

        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        return roles.includes(role);
    };

    const isReader = role === "READER";
    const isAuthor = role === "AUTHOR" || role === "ADMIN";
    const isAdmin = role === "ADMIN";

    return {
        user,
        session,
        isAuthenticated,
        isLoading: isPending,
        error,
        hasSessionError,
        role,
        hasRole,
        isReader,
        isAuthor,
        isAdmin,
    };
}
