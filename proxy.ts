import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public routes that don't require authentication
const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/posts",
    "/tags",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
];
// Keep this aligned with Better-Auth cookie naming; override via env if needed.
const sessionCookieName = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || "better-auth.session_token";

// Helper to check if a path matches a pattern
function matchesRoute(pathname: string, routes: string[]): boolean {
    return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get session cookie (optimistic check)
    const sessionToken = request.cookies.get(sessionCookieName);
    const isAuthenticated = !!sessionToken;

    // If user is authenticated and trying to access login/signup, redirect to home
    if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Allow public routes
    if (matchesRoute(pathname, publicRoutes)) {
        return NextResponse.next();
    }

    // Protect dashboard and admin routes - redirect to login if not authenticated
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
        if (!isAuthenticated) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirect", `${pathname}${request.nextUrl.search}`);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files (images, etc.)
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
