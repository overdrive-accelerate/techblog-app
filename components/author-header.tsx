import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import type { Author } from "@/types/api";

interface AuthorHeaderProps {
    author: Author;
    postCount?: number;
}

export function AuthorHeader({ author, postCount = 0 }: AuthorHeaderProps) {
    return (
        <header className="bg-card text-card-foreground space-y-6 rounded-lg border p-8">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                {/* Author Avatar */}
                <Avatar className="h-24 w-24">
                    <AvatarImage src={author.image || undefined} alt={author.name} />
                    <AvatarFallback className="text-3xl">{author.name[0]}</AvatarFallback>
                </Avatar>

                {/* Author Info */}
                <div className="flex-1 space-y-3">
                    <div>
                        <Badge variant="secondary" className="mb-2">
                            {author.role || "Author"}
                        </Badge>
                        <h1 className="text-3xl font-bold tracking-tight">{author.name}</h1>
                    </div>

                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <User className="h-4 w-4" />
                        <span>
                            {postCount} {postCount === 1 ? "published post" : "published posts"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Author Bio - Placeholder for future enhancement */}
            <div className="border-t pt-6">
                <p className="text-muted-foreground">
                    Technical writer and blogger sharing insights and tutorials.
                </p>
            </div>
        </header>
    );
}
