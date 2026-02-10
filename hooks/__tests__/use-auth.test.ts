import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAuth } from "../use-auth";

// Mock the auth-client module
vi.mock("@/lib/auth-client", () => ({
    useSession: vi.fn(),
}));

// Import the mocked function so we can control its return value
import { useSession } from "@/lib/auth-client";

describe("useAuth", () => {
    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks();
    });

    describe("unauthenticated user", () => {
        it("returns null user when not authenticated", () => {
            vi.mocked(useSession).mockReturnValue({
                data: null,
                isPending: false,
                error: null,
            });

            const { result } = renderHook(() => useAuth());

            expect(result.current.user).toBeUndefined();
            expect(result.current.isAuthenticated).toBe(false);
            expect(result.current.isLoading).toBe(false);
            expect(result.current.hasSessionError).toBe(false);
        });

        it("returns loading state when session is pending", () => {
            vi.mocked(useSession).mockReturnValue({
                data: null,
                isPending: true,
                error: null,
            });

            const { result } = renderHook(() => useAuth());

            expect(result.current.isLoading).toBe(true);
            expect(result.current.isAuthenticated).toBe(false);
        });

        it("returns error when session lookup fails", () => {
            const mockError = new Error("Session lookup failed");

            vi.mocked(useSession).mockReturnValue({
                data: null,
                isPending: false,
                error: mockError,
            });

            const { result } = renderHook(() => useAuth());

            expect(result.current.error).toBe(mockError);
            expect(result.current.hasSessionError).toBe(true);
            expect(result.current.isAuthenticated).toBe(false);
        });
    });

    describe("authenticated user", () => {
        it("returns user data when authenticated", () => {
            const mockUser = {
                id: "user-1",
                email: "test@example.com",
                name: "Test User",
                emailVerified: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                role: "READER" as const,
            };

            vi.mocked(useSession).mockReturnValue({
                data: { user: mockUser, session: {} },
                isPending: false,
                error: null,
            });

            const { result } = renderHook(() => useAuth());

            expect(result.current.user).toEqual(mockUser);
            expect(result.current.isAuthenticated).toBe(true);
            expect(result.current.role).toBe("READER");
        });

        it("returns session data", () => {
            const mockSession = {
                user: {
                    id: "user-1",
                    email: "test@example.com",
                    name: "Test User",
                    emailVerified: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    role: "AUTHOR" as const,
                },
                session: { id: "session-1", expiresAt: new Date() },
            };

            vi.mocked(useSession).mockReturnValue({
                data: mockSession,
                isPending: false,
                error: null,
            });

            const { result } = renderHook(() => useAuth());

            expect(result.current.session).toEqual(mockSession);
        });
    });

    describe("role-based access control", () => {
        describe("hasRole function", () => {
            it("returns true for matching single role", () => {
                vi.mocked(useSession).mockReturnValue({
                    data: {
                        user: {
                            id: "user-1",
                            email: "test@example.com",
                            name: "Test User",
                            emailVerified: true,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            role: "AUTHOR" as const,
                        },
                        session: {},
                    },
                    isPending: false,
                    error: null,
                });

                const { result } = renderHook(() => useAuth());

                expect(result.current.hasRole("AUTHOR")).toBe(true);
            });

            it("returns false for non-matching role", () => {
                vi.mocked(useSession).mockReturnValue({
                    data: {
                        user: {
                            id: "user-1",
                            email: "test@example.com",
                            name: "Test User",
                            emailVerified: true,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            role: "READER" as const,
                        },
                        session: {},
                    },
                    isPending: false,
                    error: null,
                });

                const { result } = renderHook(() => useAuth());

                expect(result.current.hasRole("ADMIN")).toBe(false);
            });

            it("returns true when role is in array of roles", () => {
                vi.mocked(useSession).mockReturnValue({
                    data: {
                        user: {
                            id: "user-1",
                            email: "test@example.com",
                            name: "Test User",
                            emailVerified: true,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            role: "AUTHOR" as const,
                        },
                        session: {},
                    },
                    isPending: false,
                    error: null,
                });

                const { result } = renderHook(() => useAuth());

                expect(result.current.hasRole(["READER", "AUTHOR"])).toBe(true);
            });

            it("returns false when role is not in array", () => {
                vi.mocked(useSession).mockReturnValue({
                    data: {
                        user: {
                            id: "user-1",
                            email: "test@example.com",
                            name: "Test User",
                            emailVerified: true,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            role: "READER" as const,
                        },
                        session: {},
                    },
                    isPending: false,
                    error: null,
                });

                const { result } = renderHook(() => useAuth());

                expect(result.current.hasRole(["AUTHOR", "ADMIN"])).toBe(false);
            });

            it("returns false when user has no role", () => {
                vi.mocked(useSession).mockReturnValue({
                    data: {
                        user: {
                            id: "user-1",
                            email: "test@example.com",
                            name: "Test User",
                            emailVerified: true,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                        session: {},
                    },
                    isPending: false,
                    error: null,
                });

                const { result } = renderHook(() => useAuth());

                expect(result.current.hasRole("READER")).toBe(false);
            });
        });

        describe("role helper properties", () => {
            it("isReader is true for READER role", () => {
                vi.mocked(useSession).mockReturnValue({
                    data: {
                        user: {
                            id: "user-1",
                            email: "test@example.com",
                            name: "Test User",
                            emailVerified: true,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            role: "READER" as const,
                        },
                        session: {},
                    },
                    isPending: false,
                    error: null,
                });

                const { result } = renderHook(() => useAuth());

                expect(result.current.isReader).toBe(true);
                expect(result.current.isAuthor).toBe(false);
                expect(result.current.isAdmin).toBe(false);
            });

            it("isAuthor is true for AUTHOR role", () => {
                vi.mocked(useSession).mockReturnValue({
                    data: {
                        user: {
                            id: "user-1",
                            email: "test@example.com",
                            name: "Test User",
                            emailVerified: true,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            role: "AUTHOR" as const,
                        },
                        session: {},
                    },
                    isPending: false,
                    error: null,
                });

                const { result } = renderHook(() => useAuth());

                expect(result.current.isReader).toBe(false);
                expect(result.current.isAuthor).toBe(true);
                expect(result.current.isAdmin).toBe(false);
            });

            it("isAuthor and isAdmin are true for ADMIN role", () => {
                vi.mocked(useSession).mockReturnValue({
                    data: {
                        user: {
                            id: "user-1",
                            email: "test@example.com",
                            name: "Test User",
                            emailVerified: true,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            role: "ADMIN" as const,
                        },
                        session: {},
                    },
                    isPending: false,
                    error: null,
                });

                const { result } = renderHook(() => useAuth());

                expect(result.current.isReader).toBe(false);
                expect(result.current.isAuthor).toBe(true); // ADMIN is also an author
                expect(result.current.isAdmin).toBe(true);
            });

            it("all role helpers are false when no role", () => {
                vi.mocked(useSession).mockReturnValue({
                    data: {
                        user: {
                            id: "user-1",
                            email: "test@example.com",
                            name: "Test User",
                            emailVerified: true,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                        session: {},
                    },
                    isPending: false,
                    error: null,
                });

                const { result } = renderHook(() => useAuth());

                expect(result.current.isReader).toBe(false);
                expect(result.current.isAuthor).toBe(false);
                expect(result.current.isAdmin).toBe(false);
            });
        });
    });
});
