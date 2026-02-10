import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react()],
    test: {
        // Use jsdom for DOM testing
        environment: "jsdom",

        // Global test setup
        setupFiles: ["./vitest.setup.tsx"],

        // Enable global test APIs (describe, it, expect, etc.)
        globals: true,

        // Coverage configuration
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
            exclude: [
                "node_modules/",
                "vitest.setup.ts",
                "vitest.config.ts",
                "**/*.config.{js,ts,mjs,cjs}",
                "**/*.d.ts",
                ".next/",
                "out/",
                "public/",
            ],
        },

        // Test file patterns
        include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],

        // Exclude patterns
        exclude: ["node_modules", ".next", "out", "build", "dist", "**/*.config.{js,ts,mjs,cjs}"],

        // Server options for module resolution
        server: {
            deps: {
                inline: ["zod"],
            },
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./"),
        },
    },
});
