"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateComment } from "@/hooks/use-comments";
import { toast } from "sonner";

const commentSchema = z.object({
    content: z
        .string()
        .min(1, "Comment cannot be empty")
        .max(1000, "Comment is too long (max 1000 characters)"),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface CommentFormProps {
    postId: string;
    onSuccess?: () => void;
}

export function CommentForm({ postId, onSuccess }: CommentFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const createComment = useCreateComment();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CommentFormData>({
        resolver: zodResolver(commentSchema),
    });

    const onSubmit = async (data: CommentFormData) => {
        setIsSubmitting(true);

        try {
            await createComment.mutateAsync({
                postId,
                content: data.content,
            });

            toast.success("Comment posted successfully!");
            reset();
            onSuccess?.();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to post comment");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="content">Add a comment</Label>
                <Textarea
                    id="content"
                    placeholder="Share your thoughts..."
                    rows={4}
                    disabled={isSubmitting}
                    {...register("content")}
                />
                {errors.content && (
                    <p className="text-destructive text-sm">{errors.content.message}</p>
                )}
            </div>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
        </form>
    );
}
