"use client";

import { useState } from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateUserRole } from "@/hooks/use-users";
import { formatDistanceToNow } from "@/lib/date-utils";
import { toast } from "sonner";
import { MoreHorizontal, Shield, PenTool, User as UserIcon, Loader2, Users } from "lucide-react";
import type { User } from "@/types/api";

interface AdminUsersTableProps {
    users: User[];
    isLoading?: boolean;
    onRoleChanged?: () => void;
}

const roleConfig = {
    ADMIN: {
        label: "Admin",
        variant: "destructive" as const,
        icon: Shield,
    },
    AUTHOR: {
        label: "Author",
        variant: "default" as const,
        icon: PenTool,
    },
    READER: {
        label: "Reader",
        variant: "secondary" as const,
        icon: UserIcon,
    },
};

export function AdminUsersTable({ users, isLoading, onRoleChanged }: AdminUsersTableProps) {
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [newRole, setNewRole] = useState<"ADMIN" | "AUTHOR" | "READER">("READER");
    const updateRole = useUpdateUserRole();

    const handleRoleClick = (user: User) => {
        setSelectedUser(user);
        setNewRole(user.role);
        setRoleDialogOpen(true);
    };

    const handleConfirmRoleChange = async () => {
        if (!selectedUser || newRole === selectedUser.role) return;

        try {
            await updateRole.mutateAsync({
                userId: selectedUser.id,
                role: newRole,
            });
            toast.success(`Role updated to ${roleConfig[newRole].label}`);
            setRoleDialogOpen(false);
            setSelectedUser(null);
            onRoleChanged?.();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to update role";
            toast.error(message);
        }
    };

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: "name",
            header: "User",
            cell: ({ row }) => {
                const user = row.original;
                const initials = user.name
                    ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                    : user.email[0].toUpperCase();

                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-medium">{user.name || "Unnamed User"}</span>
                            <span className="text-muted-foreground text-sm">{user.email}</span>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => {
                const role = row.original.role;
                const config = roleConfig[role];
                const Icon = config.icon;

                return (
                    <Badge variant={config.variant} className="gap-1">
                        <Icon className="h-3 w-3" />
                        {config.label}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "_count.posts",
            header: "Posts",
            cell: ({ row }) => (
                <span className="text-sm font-medium">{row.original._count?.posts || 0}</span>
            ),
        },
        {
            accessorKey: "_count.comments",
            header: "Comments",
            cell: ({ row }) => (
                <span className="text-sm font-medium">{row.original._count?.comments || 0}</span>
            ),
        },
        {
            accessorKey: "emailVerified",
            header: "Verified",
            cell: ({ row }) => (
                <Badge variant={row.original.emailVerified ? "outline" : "secondary"}>
                    {row.original.emailVerified ? "Yes" : "No"}
                </Badge>
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Joined",
            cell: ({ row }) => (
                <span className="text-muted-foreground text-sm">
                    {formatDistanceToNow(row.original.createdAt)}
                </span>
            ),
        },
        {
            id: "actions",
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleRoleClick(user)}>
                                <Shield className="mr-2 h-4 w-4" />
                                Change Role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem disabled>
                                <UserIcon className="mr-2 h-4 w-4" />
                                View Profile
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data: users,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
            </div>
        );
    }

    if (!users || users.length === 0) {
        return (
            <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-dashed">
                <div className="text-center">
                    <Users className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                    <h3 className="text-lg font-semibold">No users found</h3>
                    <p className="text-muted-foreground text-sm">
                        Try adjusting your search or filters.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-muted/50">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Change Role Dialog */}
            <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change User Role</DialogTitle>
                        <DialogDescription>
                            Change the role for {selectedUser?.name || selectedUser?.email}. This
                            will update their permissions immediately.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage
                                    src={selectedUser?.image || undefined}
                                    alt={selectedUser?.name || "User"}
                                />
                                <AvatarFallback>
                                    {selectedUser?.name?.[0]?.toUpperCase() ||
                                        selectedUser?.email?.[0]?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">
                                    {selectedUser?.name || "Unnamed User"}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    {selectedUser?.email}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">New Role</label>
                            <Select
                                value={newRole}
                                onValueChange={(value) =>
                                    setNewRole(value as "ADMIN" | "AUTHOR" | "READER")
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ADMIN">
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-4 w-4" />
                                            Admin - Full platform access
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="AUTHOR">
                                        <div className="flex items-center gap-2">
                                            <PenTool className="h-4 w-4" />
                                            Author - Can create posts
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="READER">
                                        <div className="flex items-center gap-2">
                                            <UserIcon className="h-4 w-4" />
                                            Reader - Can read and comment
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setRoleDialogOpen(false)}
                            disabled={updateRole.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmRoleChange}
                            disabled={updateRole.isPending || newRole === selectedUser?.role}
                        >
                            {updateRole.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Update Role
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
