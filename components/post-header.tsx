import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, Clock } from "lucide-react";
import type { Post } from "@/types/api";
import { formatDate } from "@/lib/date-utils";

interface PostHeaderProps {
    post: Post;
}

export function PostHeader({ post }: PostHeaderProps) {
    // Calculate reading time (rough estimate: 200 words per minute)
    const wordCount = post.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    return (
        <header className="space-y-6">
            {/* Cover Image */}
            {post.coverImage && (
                <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-lg">
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="100vw"
                        className="h-full w-full object-cover"
                        unoptimized
                    />
                </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                    <Link key={tag.id} href={`/tags/${tag.slug}`}>
                        <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer">
                            {tag.name}
                        </Badge>
                    </Link>
                ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">{post.title}</h1>

            {/* Excerpt */}
            {post.excerpt && <p className="text-muted-foreground text-xl">{post.excerpt}</p>}

            {/* Author and Meta Info */}
            <div className="flex flex-wrap items-center gap-4 border-y py-4">
                <Link
                    href={`/authors/${post.author.id}`}
                    className="flex items-center gap-3 transition-opacity hover:opacity-80"
                >
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={post.author.image || undefined} alt={post.author.name} />
                        <AvatarFallback className="text-lg">{post.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-semibold">{post.author.name}</span>
                        <span className="text-muted-foreground text-sm">Author</span>
                    </div>
                </Link>

                <div className="text-muted-foreground ml-auto flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>{readingTime} min read</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Eye className="h-4 w-4" />
                        <span>{post.views} views</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
