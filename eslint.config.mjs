import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    {
        rules: {
            // Disable React Compiler warnings for incompatible libraries (TanStack Table, React Hook Form)
            "react-hooks/incompatible-library": "off",
            // Disable setState in effect warning (legitimate use case for blob URLs)
            "react-hooks/set-state-in-effect": "off",
            // Disable unescaped entities - apostrophes and quotes are fine in JSX text
            "react/no-unescaped-entities": "off",
        },
    },
    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
    ]),
]);

export default eslintConfig;
