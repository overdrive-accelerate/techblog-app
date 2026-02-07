"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import {
    FileText,
    PenSquare,
    Clock,
    MessageSquare,
    Shield,
    LayoutDashboard,
} from "lucide-react";

interface SidebarItem {
    title: string;
    href: string;
    icon: React.ReactNode;
    adminOnly?: boolean;
}

const sidebarItems: SidebarItem[] = [
    {
        title: "Overview",
        href: "/dashboard",
        icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
        title: "My Posts",
        href: "/dashboard/posts",
        icon: <FileText className="h-4 w-4" />,
    },
    {
        title: "New Post",
        href: "/dashboard/posts/new",
        icon: <PenSquare className="h-4 w-4" />,
    },
    {
        title: "Publish Requests",
        href: "/dashboard/requests",
        icon: <Clock className="h-4 w-4" />,
    },
    {
        title: "My Comments",
        href: "/dashboard/comments",
        icon: <MessageSquare className="h-4 w-4" />,
    },
];

const adminItems: SidebarItem[] = [
    {
        title: "Admin Panel",
        href: "/admin",
        icon: <Shield className="h-4 w-4" />,
        adminOnly: true,
    },
];

export function DashboardSidebar() {
    const pathname = usePathname();
    const { isAdmin } = useAuth();

    return (
        <aside className="bg-card flex w-64 flex-col border-r">
            {/* Sidebar Header */}
            <div className="border-b p-4">
                <h2 className="text-lg font-semibold">Dashboard</h2>
                <p className="text-muted-foreground text-sm">Manage your content</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-4">
                <div className="space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                )}
                            >
                                {item.icon}
                                {item.title}
                            </Link>
                        );
                    })}
                </div>

                {/* Admin Section */}
                {isAdmin && (
                    <div className="mt-6 space-y-1">
                        <p className="text-muted-foreground px-3 text-xs font-semibold uppercase">
                            Admin
                        </p>
                        {adminItems.map((item) => {
                            const isActive = pathname.startsWith(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                    )}
                                >
                                    {item.icon}
                                    {item.title}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </nav>
        </aside>
    );
}
