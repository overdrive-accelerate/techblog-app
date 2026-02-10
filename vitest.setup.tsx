import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import React from "react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { server } from "./__tests__/mocks/server";

// Start MSW server before all tests
beforeAll(() => {
    server.listen({ onUnhandledRequest: "warn" });
});

// Reset handlers after each test
afterEach(() => {
    server.resetHandlers();
    cleanup();
});

// Stop MSW server after all tests
afterAll(() => {
    server.close();
});

// Mock Next.js router
vi.mock("next/navigation", () => ({
    useRouter: vi.fn(() => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
    })),
    useSearchParams: vi.fn(() => ({
        get: vi.fn(),
    })),
    usePathname: vi.fn(() => "/"),
    useParams: vi.fn(() => ({})),
}));

// Mock Next.js image component
vi.mock("next/image", () => ({
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
        const { src, alt, ...rest } = props;
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={src as string} alt={alt} {...rest} />;
    },
}));

// Mock Next.js link component
vi.mock("next/link", () => ({
    default: ({
        children,
        href,
        ...rest
    }: {
        children: React.ReactNode;
        href: string;
    } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
        return (
            <a href={href} {...rest}>
                {children}
            </a>
        );
    },
}));

// Set up environment variables for tests
process.env.NEXT_PUBLIC_API_URL = "http://localhost:3001";
process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
