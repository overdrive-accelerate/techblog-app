"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublishRequests } from "@/hooks/use-publish";
import {
    LayoutDashboard,
    FileText,
    Clock,
    Tags,
    Users,
    MessageSquare,
    Shield,
} from "lucide-react";

interface SidebarItemProps {
    title: string;
    href: string;
    icon: React.ReactNode;
    badge?: number;
    badgeVariant?: "default" | "destructive" | "warning";
    isActive: boolean;
    onClick?: () => void;
}

function SidebarItem({ title, href, icon, badge, badgeVariant = "default", isActive, onClick }: SidebarItemProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                    ? "bg-amber-500 text-white shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
        >
            <div className="flex items-center gap-3">
                {icon}
                {title}
            </div>
            {badge !== undefined && badge > 0 && (
                <Badge
                    variant={isActive ? "secondary" : badgeVariant === "warning" ? "default" : badgeVariant}
                    className={cn(
                        "ml-auto h-5 min-w-5 justify-center px-1.5 text-xs",
                        isActive && "bg-white/20 text-white hover:bg-white/30",
                        !isActive && badgeVariant === "warning" && "bg-amber-500 text-white hover:bg-amber-600",
                    )}
                >
                    {badge}
                </Badge>
            )}
        </Link>
    );
}

interface AdminSidebarProps {
    mobile?: boolean;
    onNavigate?: () => void;
}

export function AdminSidebar({ mobile = false, onNavigate }: AdminSidebarProps = {}) {
    const pathname = usePathname();
    const { data: requestsData, isLoading: requestsLoading } = usePublishRequests();

    const pendingRequestsCount = requestsData?.requests?.filter((r) => r.status === "PENDING").length || 0;

    const sidebarItems = [
        {
            title: "Overview",
            href: "/admin",
            icon: <LayoutDashboard className="h-4 w-4" />,
        },
        {
            title: "Publish Requests",
            href: "/admin/requests",
            icon: <Clock className="h-4 w-4" />,
            badge: pendingRequestsCount,
            badgeVariant: "warning" as const,
        },
        {
            title: "All Posts",
            href: "/admin/posts",
            icon: <FileText className="h-4 w-4" />,
        },
        {
            title: "Tags",
            href: "/admin/tags",
            icon: <Tags className="h-4 w-4" />,
        },
        {
            title: "Users",
            href: "/admin/users",
            icon: <Users className="h-4 w-4" />,
        },
        {
            title: "Comments",
            href: "/admin/comments",
            icon: <MessageSquare className="h-4 w-4" />,
        },
    ];

    const sidebarContent = (
        <>
            {/* Header - only show on desktop */}
            {!mobile && (
                <div className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white">
                        <Shield className="h-4 w-4" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold">Admin Panel</h2>
                        <p className="text-muted-foreground text-xs">Manage your platform</p>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                <p className="text-muted-foreground mb-2 px-3 text-xs font-medium uppercase tracking-wider">
                    Management
                </p>
                {requestsLoading ? (
                    <div className="space-y-1">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-10 w-full rounded-lg" />
                        ))}
                    </div>
                ) : (
                    sidebarItems.map((item) => {
                        const isActive =
                            item.href === "/admin"
                                ? pathname === "/admin"
                                : pathname.startsWith(item.href);

                        return (
                            <SidebarItem
                                key={item.href}
                                title={item.title}
                                href={item.href}
                                icon={item.icon}
                                badge={item.badge}
                                badgeVariant={item.badgeVariant}
                                isActive={isActive}
                                onClick={onNavigate}
                            />
                        );
                    })
                )}
            </nav>
        </>
    );

    if (mobile) {
        return <div className="flex h-full flex-col">{sidebarContent}</div>;
    }

    return (
        <aside className="bg-card hidden w-64 flex-col border-r lg:flex">
            {sidebarContent}
        </aside>
    );
}
