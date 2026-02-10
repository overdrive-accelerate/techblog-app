"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useCreateTag, useUpdateTag } from "@/hooks/use-tags";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { Tag } from "@/types/api";

const tagFormSchema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
    description: z
        .string()
        .max(200, "Description must be less than 200 characters")
        .optional()
        .or(z.literal("")),
});

type TagFormData = z.infer<typeof tagFormSchema>;

interface TagFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tag?: Tag | null;
    onSuccess?: () => void;
}

export function TagFormDialog({ open, onOpenChange, tag, onSuccess }: TagFormDialogProps) {
    const isEditing = !!tag;
    const createTag = useCreateTag();
    const updateTag = useUpdateTag();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TagFormData>({
        resolver: zodResolver(tagFormSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    // Reset form when dialog opens/closes or tag changes
    useEffect(() => {
        if (open) {
            reset({
                name: tag?.name || "",
                description: tag?.description || "",
            });
        }
    }, [open, tag, reset]);

    const isLoading = createTag.isPending || updateTag.isPending;

    const onSubmit = async (data: TagFormData) => {
        try {
            if (isEditing && tag) {
                await updateTag.mutateAsync({
                    id: tag.id,
                    data: {
                        name: data.name,
                        description: data.description || undefined,
                    },
                });
                toast.success("Tag updated successfully");
            } else {
                await createTag.mutateAsync({
                    name: data.name,
                    description: data.description || undefined,
                });
                toast.success("Tag created successfully");
            }
            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : `Failed to ${isEditing ? "update" : "create"} tag`,
            );
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Tag" : "Create New Tag"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Update the tag details below."
                            : "Add a new tag to organize your content."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            {...register("name")}
                            placeholder="e.g., React, TypeScript, DevOps"
                            disabled={isLoading}
                        />
                        {errors.name && (
                            <p className="text-destructive text-sm">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                            id="description"
                            {...register("description")}
                            placeholder="A brief description of this tag..."
                            rows={3}
                            disabled={isLoading}
                        />
                        {errors.description && (
                            <p className="text-destructive text-sm">{errors.description.message}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEditing ? "Update Tag" : "Create Tag"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
