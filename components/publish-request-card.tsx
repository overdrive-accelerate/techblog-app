"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useCancelPublishRequest, type PublishRequest } from "@/hooks/use-publish";
import { formatDistanceToNow } from "@/lib/date-utils";
import { toast } from "sonner";
import {
    Clock,
    CheckCircle,
    XCircle,
    Pencil,
    Trash2,
    MessageSquare,
    Loader2,
} from "lucide-react";

interface PublishRequestCardProps {
    request: PublishRequest;
    onCancelled?: () => void;
}

const statusConfig = {
    PENDING: {
        label: "Pending",
        variant: "outline" as const,
        icon: Clock,
        color: "text-yellow-600",
    },
    APPROVED: {
        label: "Approved",
        variant: "default" as const,
        icon: CheckCircle,
        color: "text-green-600",
    },
    REJECTED: {
        label: "Rejected",
        variant: "destructive" as const,
        icon: XCircle,
        color: "text-red-600",
    },
};

export function PublishRequestCard({ request, onCancelled }: PublishRequestCardProps) {
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const cancelRequest = useCancelPublishRequest();

    const config = statusConfig[request.status];
    const StatusIcon = config.icon;
    const isPending = request.status === "PENDING";

    const handleCancel = async () => {
        try {
            await cancelRequest.mutateAsync(request.id);
            toast.success("Publish request cancelled");
            setCancelDialogOpen(false);
            onCancelled?.();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to cancel request");
        }
    };

    return (
        <>
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-1">
                            <CardTitle className="line-clamp-1 text-lg">
                                {request.post.title}
                            </CardTitle>
                            <CardDescription>
                                Requested {formatDistanceToNow(request.createdAt)}
                            </CardDescription>
                        </div>
                        <Badge variant={config.variant} className="gap-1">
                            <StatusIcon className="h-3 w-3" />
                            {config.label}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="pb-3">
                    {/* Admin Feedback Message */}
                    {request.message && request.status !== "PENDING" && (
                        <div className="bg-muted rounded-md p-3">
                            <div className="mb-1 flex items-center gap-2 text-sm font-medium">
                                <MessageSquare className="h-4 w-4" />
                                Admin Feedback
                            </div>
                            <p className="text-muted-foreground text-sm">{request.message}</p>
                        </div>
                    )}

                    {/* Author's Original Message */}
                    {request.message && request.status === "PENDING" && (
                        <div className="bg-muted rounded-md p-3">
                            <div className="mb-1 flex items-center gap-2 text-sm font-medium">
                                <MessageSquare className="h-4 w-4" />
                                Your Message
                            </div>
                            <p className="text-muted-foreground text-sm">{request.message}</p>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/posts/${request.post.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            {request.status === "REJECTED" ? "Edit & Resubmit" : "View Post"}
                        </Link>
                    </Button>

                    {isPending && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setCancelDialogOpen(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Cancel Request
                        </Button>
                    )}
                </CardFooter>
            </Card>

            {/* Cancel Confirmation Dialog */}
            <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancel Publish Request</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to cancel this publish request? Your post will be
                            reverted to draft status and you can submit a new request later.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setCancelDialogOpen(false)}
                            disabled={cancelRequest.isPending}
                        >
                            Keep Request
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleCancel}
                            disabled={cancelRequest.isPending}
                        >
                            {cancelRequest.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="mr-2 h-4 w-4" />
                            )}
                            Cancel Request
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
