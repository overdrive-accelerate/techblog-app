"use client";

import { useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

interface GlobalErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
    useEffect(() => {
        // Log error to console in development
        console.error("Global error:", error);
    }, [error]);

    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <div
                    style={{
                        display: "flex",
                        minHeight: "100vh",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "1rem",
                        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
                    }}
                >
                    <div style={{ textAlign: "center", maxWidth: "500px" }}>
                        <div
                            style={{
                                backgroundColor: "rgba(239, 68, 68, 0.1)",
                                borderRadius: "9999px",
                                width: "80px",
                                height: "80px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 24px",
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="40"
                                height="40"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="rgb(239, 68, 68)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                                <line x1="12" y1="9" x2="12" y2="13" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </div>

                        <h1
                            style={{
                                fontSize: "1.875rem",
                                fontWeight: "bold",
                                marginBottom: "0.5rem",
                            }}
                        >
                            Something went wrong!
                        </h1>

                        <p
                            style={{
                                color: "#6b7280",
                                marginBottom: "1.5rem",
                            }}
                        >
                            We encountered an unexpected error in the application. Please try
                            refreshing the page.
                        </p>

                        {error.digest && (
                            <p
                                style={{
                                    color: "#9ca3af",
                                    fontSize: "0.75rem",
                                    marginBottom: "1.5rem",
                                }}
                            >
                                Error ID: {error.digest}
                            </p>
                        )}

                        <div
                            style={{
                                display: "flex",
                                gap: "12px",
                                justifyContent: "center",
                                flexWrap: "wrap",
                            }}
                        >
                            <button
                                onClick={reset}
                                style={{
                                    backgroundColor: "#000",
                                    color: "#fff",
                                    padding: "10px 20px",
                                    borderRadius: "6px",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                }}
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => (window.location.href = "/")}
                                style={{
                                    backgroundColor: "#fff",
                                    color: "#000",
                                    padding: "10px 20px",
                                    borderRadius: "6px",
                                    border: "1px solid #e5e7eb",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                }}
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
