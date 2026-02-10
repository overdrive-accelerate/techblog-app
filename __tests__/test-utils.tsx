import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, RenderOptions } from "@testing-library/react";
import { ReactElement, ReactNode } from "react";

/**
 * Creates a new QueryClient for each test to ensure isolation
 */
export function createTestQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                retry: false, // Don't retry failed requests in tests
                gcTime: Infinity, // Prevent garbage collection during tests
            },
            mutations: {
                retry: false,
            },
        },
    });
}

/**
 * Custom render function that wraps components with necessary providers
 */
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
    queryClient?: QueryClient;
}

export function renderWithProviders(
    ui: ReactElement,
    { queryClient = createTestQueryClient(), ...renderOptions }: CustomRenderOptions = {},
) {
    function Wrapper({ children }: { children: ReactNode }) {
        return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    }

    return {
        ...render(ui, { wrapper: Wrapper, ...renderOptions }),
        queryClient,
    };
}

// Re-export everything from React Testing Library
export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
