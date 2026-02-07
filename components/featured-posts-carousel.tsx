"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Clock, Eye } from "lucide-react";
import type { Post } from "@/types/api";

interface FeaturedPostsCarouselProps {
    posts: Post[];
}

export function FeaturedPostsCarousel({ posts }: FeaturedPostsCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, [posts.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
    }, [posts.length]);

    // Auto-rotate every 6 seconds
    useEffect(() => {
        const interval = setInterval(nextSlide, 6000);
        return () => clearInterval(interval);
    }, [nextSlide]);

    if (!posts || posts.length === 0) {
        return null;
    }

    const currentPost = posts[currentIndex];
    const formattedDate = currentPost.publishedAt
        ? new Date(currentPost.publishedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
          })
        : null;

    return (
        <div className="relative w-full">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Featured Posts</h2>
                    <p className="text-muted-foreground mt-1">Handpicked articles for you</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={prevSlide}
                        aria-label="Previous post"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={nextSlide}
                        aria-label="Next post"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="relative overflow-hidden rounded-xl">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {posts.map((post) => (
                        <div key={post.id} className="w-full flex-shrink-0">
                            <Link href={`/posts/${post.slug}`} className="group block">
                                <div className="bg-muted relative aspect-[21/9] overflow-hidden rounded-xl">
                                    {post.coverImage ? (
                                        <Image
                                            src={post.coverImage}
                                            alt={post.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            priority
                                        />
                                    ) : (
                                        <div className="from-primary/20 to-primary/5 absolute inset-0 bg-gradient-to-br" />
                                    )}
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                    {/* Content */}
                                    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                                        {/* Tags */}
                                        {post.tags && post.tags.length > 0 && (
                                            <div className="mb-3 flex flex-wrap gap-2">
                                                {post.tags.slice(0, 3).map((tag) => (
                                                    <Badge
                                                        key={tag.id}
                                                        variant="secondary"
                                                        className="bg-white/20 text-white backdrop-blur hover:bg-white/30"
                                                    >
                                                        {tag.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}

                                        {/* Title */}
                                        <h3 className="mb-2 text-2xl font-bold text-white md:text-3xl lg:text-4xl">
                                            {post.title}
                                        </h3>

                                        {/* Excerpt */}
                                        {post.excerpt && (
                                            <p className="mb-4 line-clamp-2 max-w-2xl text-sm text-white/80 md:text-base">
                                                {post.excerpt}
                                            </p>
                                        )}

                                        {/* Meta */}
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                                            {post.author && (
                                                <div className="flex items-center gap-2">
                                                    {post.author.image ? (
                                                        <Image
                                                            src={post.author.image}
                                                            alt={post.author.name || "Author"}
                                                            width={24}
                                                            height={24}
                                                            className="rounded-full"
                                                        />
                                                    ) : (
                                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs text-white">
                                                            {post.author.name?.[0] || "A"}
                                                        </div>
                                                    )}
                                                    <span>{post.author.name}</span>
                                                </div>
                                            )}
                                            {formattedDate && (
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{formattedDate}</span>
                                                </div>
                                            )}
                                            {post.views > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <Eye className="h-4 w-4" />
                                                    <span>{post.views} views</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dots indicator */}
            <div className="mt-4 flex justify-center gap-2">
                {posts.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            index === currentIndex
                                ? "bg-primary w-8"
                                : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
