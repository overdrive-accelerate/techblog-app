"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUploadImage } from "@/hooks/use-upload";
import { toast } from "sonner";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

interface CoverImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    disabled?: boolean;
}

export function CoverImageUpload({ value, onChange, disabled }: CoverImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const uploadImage = useUploadImage();

    const handleFileSelect = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be less than 5MB");
            return;
        }

        try {
            const result = await uploadImage.mutateAsync(file);
            onChange(result.url);
            toast.success("Image uploaded successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to upload image");
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleRemove = () => {
        onChange("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-2">
            <Label>Cover Image</Label>

            {value ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                    <Image src={value} alt="Cover image preview" fill className="object-cover" />
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleRemove}
                        disabled={disabled}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div
                    className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"} ${disabled ? "cursor-not-allowed opacity-50" : "hover:border-primary cursor-pointer"} `}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => !disabled && fileInputRef.current?.click()}
                >
                    {uploadImage.isPending ? (
                        <>
                            <Loader2 className="text-muted-foreground mb-2 h-8 w-8 animate-spin" />
                            <p className="text-muted-foreground text-sm">Uploading...</p>
                        </>
                    ) : (
                        <>
                            <ImageIcon className="text-muted-foreground mb-2 h-8 w-8" />
                            <p className="mb-1 text-sm font-medium">
                                Drop an image here or click to upload
                            </p>
                            <p className="text-muted-foreground text-xs">
                                PNG, JPG, WebP or GIF (max 5MB)
                            </p>
                        </>
                    )}
                </div>
            )}

            <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleInputChange}
                disabled={disabled || uploadImage.isPending}
            />
        </div>
    );
}
