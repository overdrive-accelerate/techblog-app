"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

interface MarkdownContentProps {
    content: string;
}

function MarkdownImage({ src, alt }: { src?: string | Blob; alt?: string }) {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);

    useEffect(() => {
        if (src instanceof Blob) {
            const url = URL.createObjectURL(src);
            setBlobUrl(url);
            return () => {
                URL.revokeObjectURL(url);
            };
        }

        setBlobUrl(null);
        return undefined;
    }, [src]);

    const imageSrc = typeof src === "string" ? src : blobUrl;
    if (!imageSrc) return null;

    return (
        <Image
            src={imageSrc}
            alt={alt || ""}
            width={1200}
            height={800}
            sizes="100vw"
            className="my-6 h-auto w-full rounded-lg"
            unoptimized
        />
    );
}

export function MarkdownContent({ content }: MarkdownContentProps) {
    return (
        <article className="prose prose-zinc dark:prose-invert max-w-none">
            <ReactMarkdown
                components={{
                    // Customize heading styles
                    h1: ({ children }) => (
                        <h1 className="mt-8 mb-4 text-3xl font-bold tracking-tight">{children}</h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="mt-6 mb-3 text-2xl font-bold tracking-tight">{children}</h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="mt-4 mb-2 text-xl font-semibold">{children}</h3>
                    ),
                    // Customize paragraph
                    p: ({ children }) => (
                        <p className="text-muted-foreground mb-4 leading-7">{children}</p>
                    ),
                    // Customize links
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            className="text-primary hover:text-primary/80 underline underline-offset-4"
                            target={href?.startsWith("http") ? "_blank" : undefined}
                            rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                        >
                            {children}
                        </a>
                    ),
                    // Customize lists
                    ul: ({ children }) => (
                        <ul className="mb-4 ml-6 list-disc space-y-2">{children}</ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="mb-4 ml-6 list-decimal space-y-2">{children}</ol>
                    ),
                    li: ({ children }) => (
                        <li className="text-muted-foreground leading-7">{children}</li>
                    ),
                    // Customize code blocks
                    code: ({ className, children }) => {
                        const isInline = !className;
                        if (isInline) {
                            return (
                                <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-sm">
                                    {children}
                                </code>
                            );
                        }
                        return (
                            <code className="bg-muted block overflow-x-auto rounded-lg p-4 font-mono text-sm">
                                {children}
                            </code>
                        );
                    },
                    pre: ({ children }) => (
                        <pre className="bg-muted mb-4 overflow-x-auto rounded-lg p-4">
                            {children}
                        </pre>
                    ),
                    // Customize blockquotes
                    blockquote: ({ children }) => (
                        <blockquote className="border-primary text-muted-foreground mb-4 border-l-4 pl-4 italic">
                            {children}
                        </blockquote>
                    ),
                    // Customize images
                    img: ({ src, alt }) => <MarkdownImage src={src} alt={alt} />,
                    // Customize horizontal rules
                    hr: () => <hr className="border-border my-8" />,
                }}
            >
                {content}
            </ReactMarkdown>
        </article>
    );
}
