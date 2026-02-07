"use client";

import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import { useUploadImage } from "@/hooks/use-upload";
import { toast } from "sonner";
import {
    Bold,
    Italic,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Code,
    Link,
    ImageIcon,
    Quote,
    Loader2,
} from "lucide-react";

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    error?: string;
}

type MarkdownAction = {
    icon: React.ReactNode;
    label: string;
    prefix: string;
    suffix: string;
    block?: boolean;
};

const markdownActions: MarkdownAction[] = [
    { icon: <Bold className="h-4 w-4" />, label: "Bold", prefix: "**", suffix: "**" },
    { icon: <Italic className="h-4 w-4" />, label: "Italic", prefix: "_", suffix: "_" },
    {
        icon: <Heading1 className="h-4 w-4" />,
        label: "Heading 1",
        prefix: "# ",
        suffix: "",
        block: true,
    },
    {
        icon: <Heading2 className="h-4 w-4" />,
        label: "Heading 2",
        prefix: "## ",
        suffix: "",
        block: true,
    },
    {
        icon: <Heading3 className="h-4 w-4" />,
        label: "Heading 3",
        prefix: "### ",
        suffix: "",
        block: true,
    },
    {
        icon: <List className="h-4 w-4" />,
        label: "Bullet List",
        prefix: "- ",
        suffix: "",
        block: true,
    },
    {
        icon: <ListOrdered className="h-4 w-4" />,
        label: "Numbered List",
        prefix: "1. ",
        suffix: "",
        block: true,
    },
    { icon: <Code className="h-4 w-4" />, label: "Code", prefix: "`", suffix: "`" },
    { icon: <Quote className="h-4 w-4" />, label: "Quote", prefix: "> ", suffix: "", block: true },
    { icon: <Link className="h-4 w-4" />, label: "Link", prefix: "[", suffix: "](url)" },
];

export function MarkdownEditor({ value, onChange, disabled, error }: MarkdownEditorProps) {
    const [activeTab, setActiveTab] = useState("write");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const uploadImage = useUploadImage();

    const insertMarkdown = (action: MarkdownAction) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);

        let newText: string;
        let cursorPosition: number;

        if (action.block && start > 0 && value[start - 1] !== "\n") {
            // Add newline before block elements if not at start
            newText =
                value.substring(0, start) +
                "\n" +
                action.prefix +
                selectedText +
                action.suffix +
                value.substring(end);
            cursorPosition =
                start + 1 + action.prefix.length + selectedText.length + action.suffix.length;
        } else {
            newText =
                value.substring(0, start) +
                action.prefix +
                selectedText +
                action.suffix +
                value.substring(end);
            cursorPosition =
                start + action.prefix.length + selectedText.length + action.suffix.length;
        }

        onChange(newText);

        // Restore focus and cursor position
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(cursorPosition, cursorPosition);
        }, 0);
    };

    const handleImageUpload = async (file: File) => {
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
            const imageMarkdown = `![Image](${result.url})`;

            const textarea = textareaRef.current;
            if (textarea) {
                const start = textarea.selectionStart;
                const newText = value.substring(0, start) + imageMarkdown + value.substring(start);
                onChange(newText);
            } else {
                onChange(value + "\n" + imageMarkdown);
            }

            toast.success("Image uploaded and inserted");
        } catch (error: any) {
            toast.error(error.message || "Failed to upload image");
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
        e.target.value = "";
    };

    return (
        <div className="space-y-2">
            <Label>Content</Label>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="write">Write</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="write" className="mt-2 space-y-2">
                    {/* Toolbar */}
                    <div className="bg-muted/50 flex flex-wrap gap-1 rounded-md border p-1">
                        {markdownActions.map((action) => (
                            <Button
                                key={action.label}
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => insertMarkdown(action)}
                                disabled={disabled}
                                title={action.label}
                            >
                                {action.icon}
                            </Button>
                        ))}
                        <div className="bg-border mx-1 h-8 w-px" />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={disabled || uploadImage.isPending}
                            title="Insert Image"
                        >
                            {uploadImage.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <ImageIcon className="h-4 w-4" />
                            )}
                        </Button>
                    </div>

                    <Textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Write your post content in Markdown..."
                        disabled={disabled}
                        className="min-h-[400px] resize-y font-mono text-sm"
                    />

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileInputChange}
                    />
                </TabsContent>

                <TabsContent value="preview" className="mt-2">
                    <div className="bg-background min-h-[400px] rounded-md border p-4">
                        {value ? (
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <ReactMarkdown>{value}</ReactMarkdown>
                            </div>
                        ) : (
                            <p className="text-muted-foreground">Nothing to preview yet...</p>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
    );
}
