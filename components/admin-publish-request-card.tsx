"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    useApprovePublishRequest,
    useRejectPublishRequest,
    type PublishRequest,
} from "@/hooks/use-publish";
import { formatDistanceToNow } from "@/lib/date-utils";
import { toast } from "sonner";
import {
    Clock,
    CheckCircle,
    XCircle,
    ExternalLink,
    MessageSquare,
    Loader2,
    Check,
    X,
} from "lucide-react";

interface AdminPublishRequestCardProps {
    request: PublishRequest;
    onUpdated?: () => void;
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

export function AdminPublishRequestCard({ request, onUpdated }: AdminPublishRequestCardProps) {
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [message, setMessage] = useState("");

    const approveRequest = useApprovePublishRequest();
    const rejectRequest = useRejectPublishRequest();

    const config = statusConfig[request.status];
    const StatusIcon = config.icon;
    const isPending = request.status === "PENDING";

    const handleApprove = async () => {
        try {
            await approveRequest.mutateAsync({
                requestId: request.id,
                message: message || undefined,
            });
            toast.success("Request approved - Post is now published");
            setApproveDialogOpen(false);
            setMessage("");
            onUpdated?.();
        } catch (error: any) {
            toast.error(error.message || "Failed to approve request");
        }
    };

    const handleReject = async () => {
        try {
            await rejectRequest.mutateAsync({
                requestId: request.id,
                message: message || undefined,
            });
            toast.success("Request rejected");
            setRejectDialogOpen(false);
            setMessage("");
            onUpdated?.();
        } catch (error: any) {
            toast.error(error.message || "Failed to reject request");
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

                <CardContent className="space-y-3 pb-3">
                    {/* Author Info */}
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={request.author?.image || undefined} />
                            <AvatarFallback>{request.author?.name?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium">{request.author?.name}</p>
                            <p className="text-muted-foreground text-xs">{request.author?.email}</p>
                        </div>
                    </div>

                    {/* Author's Message */}
                    {request.message && request.status === "PENDING" && (
                        <div className="bg-muted rounded-md p-3">
                            <div className="mb-1 flex items-center gap-2 text-sm font-medium">
                                <MessageSquare className="h-4 w-4" />
                                Author's Note
                            </div>
                            <p className="text-muted-foreground text-sm">{request.message}</p>
                        </div>
                    )}

                    {/* Admin Response (for processed requests) */}
                    {request.message && request.status !== "PENDING" && (
                        <div className="bg-muted rounded-md p-3">
                            <div className="mb-1 flex items-center gap-2 text-sm font-medium">
                                <MessageSquare className="h-4 w-4" />
                                Admin Response
                            </div>
                            <p className="text-muted-foreground text-sm">{request.message}</p>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex-col gap-2 sm:flex-row">
                    <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                        <Link href={`/dashboard/posts/${request.post.id}/edit`} target="_blank">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Post
                        </Link>
                    </Button>

                    {isPending && (
                        <>
                            <Button
                                size="sm"
                                onClick={() => setApproveDialogOpen(true)}
                                className="w-full bg-green-600 hover:bg-green-700 sm:w-auto"
                            >
                                <Check className="mr-2 h-4 w-4" />
                                Approve
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setRejectDialogOpen(true)}
                                className="w-full sm:w-auto"
                            >
                                <X className="mr-2 h-4 w-4" />
                                Reject
                            </Button>
                        </>
                    )}
                </CardFooter>
            </Card>

            {/* Approve Dialog */}
            <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Approve Publish Request</DialogTitle>
                        <DialogDescription>
                            This will publish "{request.post.title}" and make it visible to all
                            readers.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor="approve-message">Message to Author (Optional)</Label>
                        <Textarea
                            id="approve-message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Great work! Your post is now live..."
                            rows={3}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setApproveDialogOpen(false);
                                setMessage("");
                            }}
                            disabled={approveRequest.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleApprove}
                            disabled={approveRequest.isPending}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {approveRequest.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Check className="mr-2 h-4 w-4" />
                            )}
                            Approve & Publish
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Publish Request</DialogTitle>
                        <DialogDescription>
                            The post will be reverted to draft status and the author will be
                            notified.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor="reject-message">Reason for Rejection (Recommended)</Label>
                        <Textarea
                            id="reject-message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Please provide feedback to help the author improve..."
                            rows={3}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setRejectDialogOpen(false);
                                setMessage("");
                            }}
                            disabled={rejectRequest.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={rejectRequest.isPending}
                        >
                            {rejectRequest.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <X className="mr-2 h-4 w-4" />
                            )}
                            Reject Request
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
