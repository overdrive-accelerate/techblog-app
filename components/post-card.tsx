import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Eye, MessageCircle } from "lucide-react";
import type { Post } from "@/types/api";
import { formatDistanceToNow } from "@/lib/date-utils";

interface PostCardProps {
    post: Post;
    featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
    const excerpt = post.excerpt || post.content.substring(0, 150) + "...";
    const commentCount = post.commentsCount || 0;

    return (
        <Link href={`/posts/${post.slug}`}>
            <Card
                className={`group h-full transition-all hover:shadow-lg ${
                    featured ? "md:col-span-2" : ""
                }`}
            >
                {post.coverImage && (
                    <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-t-lg">
                        <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            sizes="(min-width: 1024px) 50vw, 100vw"
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            unoptimized
                        />
                    </div>
                )}
                <CardHeader className="space-y-3 pb-3">
                    <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag.id} variant="secondary" className="text-xs">
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                    <h3
                        className={`group-hover:text-primary line-clamp-2 leading-tight font-bold tracking-tight transition-colors ${
                            featured ? "text-2xl md:text-3xl" : "text-xl"
                        }`}
                    >
                        {post.title}
                    </h3>
                </CardHeader>
                <CardContent className="pb-3">
                    <p
                        className={`text-muted-foreground ${featured ? "line-clamp-3" : "line-clamp-2"}`}
                    >
                        {excerpt}
                    </p>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage
                                src={post.author.image || undefined}
                                alt={post.author.name}
                            />
                            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">{post.author.name}</span>
                            <div className="text-muted-foreground flex items-center gap-1 text-xs">
                                <Calendar className="h-3 w-3" />
                                <span>
                                    {formatDistanceToNow(post.publishedAt || post.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{post.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{commentCount}</span>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
