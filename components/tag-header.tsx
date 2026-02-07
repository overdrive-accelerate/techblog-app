import { Badge } from "@/components/ui/badge";
import { Tag as TagIcon } from "lucide-react";
import type { Tag } from "@/types/api";

interface TagHeaderProps {
    tag: Tag;
    postCount?: number;
}

export function TagHeader({ tag, postCount }: TagHeaderProps) {
    const count = postCount ?? tag._count?.posts ?? 0;

    return (
        <header className="bg-card text-card-foreground space-y-4 rounded-lg border p-8">
            <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                    <TagIcon className="text-primary h-6 w-6" />
                </div>
                <div>
                    <Badge variant="secondary" className="mb-2">
                        Tag
                    </Badge>
                    <h1 className="text-3xl font-bold tracking-tight">{tag.name}</h1>
                </div>
            </div>

            {tag.description && <p className="text-muted-foreground text-lg">{tag.description}</p>}

            <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <span>
                    {count} {count === 1 ? "post" : "posts"}
                </span>
            </div>
        </header>
    );
}
