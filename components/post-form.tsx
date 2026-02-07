"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { CoverImageUpload } from "@/components/cover-image-upload";
import { TagMultiSelect } from "@/components/tag-multi-select";
import { MarkdownEditor } from "@/components/markdown-editor";
import { useCreatePost, useUpdatePost } from "@/hooks/use-posts";
import { useRequestPublish } from "@/hooks/use-publish";
import { postFormSchema, type PostFormData } from "@/lib/validations/post";
import { toast } from "sonner";
import { Save, Send, Loader2 } from "lucide-react";
import type { Post } from "@/types/api";

interface PostFormProps {
    post?: Post;
    mode: "create" | "edit";
}

export function PostForm({ post, mode }: PostFormProps) {
    const router = useRouter();
    const [publishDialogOpen, setPublishDialogOpen] = useState(false);
    const [publishMessage, setPublishMessage] = useState("");
    const [savedPostId, setSavedPostId] = useState<string | null>(post?.id || null);

    const createPost = useCreatePost();
    const updatePost = useUpdatePost();
    const requestPublish = useRequestPublish();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isDirty },
    } = useForm<PostFormData>({
        resolver: zodResolver(postFormSchema),
        defaultValues: {
            title: post?.title || "",
            content: post?.content || "",
            excerpt: post?.excerpt || "",
            coverImage: post?.coverImage || "",
            tags: post?.tags?.map((t) => t.name) || [],
        },
    });

    const watchedContent = watch("content");
    const watchedCoverImage = watch("coverImage");
    const watchedTags = watch("tags");

    const isLoading = createPost.isPending || updatePost.isPending;
    // Can request publish if:
    // 1. Post is saved (has an ID)
    // 2. Post status is DRAFT or REJECTED (not already pending or published)
    // For new posts, after first save they become DRAFT by default
    const canRequestPublish =
        savedPostId && (!post?.status || post?.status === "DRAFT" || post?.status === "REJECTED");

    const handleSaveDraft = async (data: PostFormData) => {
        try {
            if (mode === "create" || !savedPostId) {
                const newPost = await createPost.mutateAsync({
                    title: data.title,
                    content: data.content,
                    excerpt: data.excerpt || undefined,
                    coverImage: data.coverImage || undefined,
                    tags: data.tags,
                });
                setSavedPostId(newPost.id);
                toast.success("Post saved as draft");
                router.push(`/dashboard/posts/${newPost.id}/edit`);
            } else {
                await updatePost.mutateAsync({
                    id: savedPostId,
                    data: {
                        title: data.title,
                        content: data.content,
                        excerpt: data.excerpt || undefined,
                        coverImage: data.coverImage || undefined,
                        tags: data.tags,
                    },
                });
                toast.success("Post updated");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to save post");
        }
    };

    const handleRequestPublish = async () => {
        if (!savedPostId) {
            toast.error("Please save the post first");
            return;
        }

        try {
            await requestPublish.mutateAsync({
                postId: savedPostId,
                message: publishMessage || undefined,
            });
            toast.success("Publish request submitted");
            setPublishDialogOpen(false);
            router.push("/dashboard/posts");
        } catch (error: any) {
            toast.error(error.message || "Failed to submit publish request");
        }
    };

    const openPublishDialog = async () => {
        // Save first if there are unsaved changes
        if (isDirty) {
            const data = {
                title: watch("title"),
                content: watch("content"),
                excerpt: watch("excerpt"),
                coverImage: watch("coverImage"),
                tags: watch("tags"),
            };

            const result = postFormSchema.safeParse(data);
            if (!result.success) {
                toast.error("Please fix form errors before requesting publish");
                return;
            }

            await handleSaveDraft(result.data);
        }
        setPublishDialogOpen(true);
    };

    return (
        <>
            <form onSubmit={handleSubmit(handleSaveDraft)} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        {...register("title")}
                        placeholder="Enter post title..."
                        disabled={isLoading}
                    />
                    {errors.title && (
                        <p className="text-destructive text-sm">{errors.title.message}</p>
                    )}
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt (Optional)</Label>
                    <Textarea
                        id="excerpt"
                        {...register("excerpt")}
                        placeholder="A brief summary of your post..."
                        rows={2}
                        disabled={isLoading}
                    />
                    {errors.excerpt && (
                        <p className="text-destructive text-sm">{errors.excerpt.message}</p>
                    )}
                </div>

                {/* Cover Image */}
                <CoverImageUpload
                    value={watchedCoverImage}
                    onChange={(url) => setValue("coverImage", url, { shouldDirty: true })}
                    disabled={isLoading}
                />
                {errors.coverImage && (
                    <p className="text-destructive text-sm">{errors.coverImage.message}</p>
                )}

                {/* Tags */}
                <TagMultiSelect
                    value={watchedTags || []}
                    onChange={(tags) => setValue("tags", tags, { shouldDirty: true })}
                    disabled={isLoading}
                />
                {errors.tags && <p className="text-destructive text-sm">{errors.tags.message}</p>}

                {/* Content Editor */}
                <MarkdownEditor
                    value={watchedContent}
                    onChange={(content) => setValue("content", content, { shouldDirty: true })}
                    disabled={isLoading}
                    error={errors.content?.message}
                />

                {/* Action Buttons */}
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/dashboard/posts")}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>

                    <div className="flex gap-2">
                        <Button type="submit" variant="secondary" disabled={isLoading}>
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            Save Draft
                        </Button>

                        {canRequestPublish && (
                            <Button
                                type="button"
                                onClick={openPublishDialog}
                                disabled={isLoading || requestPublish.isPending}
                            >
                                {requestPublish.isPending ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="mr-2 h-4 w-4" />
                                )}
                                Request Publish
                            </Button>
                        )}
                    </div>
                </div>
            </form>

            {/* Publish Request Dialog */}
            <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Request to Publish</DialogTitle>
                        <DialogDescription>
                            Your post will be reviewed by an admin before being published.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2">
                        <Label htmlFor="publish-message">Message to Admin (Optional)</Label>
                        <Textarea
                            id="publish-message"
                            value={publishMessage}
                            onChange={(e) => setPublishMessage(e.target.value)}
                            placeholder="Any notes for the reviewer..."
                            rows={3}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setPublishDialogOpen(false)}
                            disabled={requestPublish.isPending}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleRequestPublish} disabled={requestPublish.isPending}>
                            {requestPublish.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="mr-2 h-4 w-4" />
                            )}
                            Submit Request
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
