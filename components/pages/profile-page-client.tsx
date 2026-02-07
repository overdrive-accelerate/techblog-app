"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useProfile, useUpdateProfile } from "@/hooks/use-profile";
import {
    User,
    Mail,
    Calendar,
    FileText,
    MessageSquare,
    Globe,
    Loader2,
    CheckCircle,
    XCircle,
    ExternalLink,
    LayoutDashboard,
    Shield,
} from "lucide-react";

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
    website: z
        .string()
        .url("Please enter a valid URL")
        .max(200)
        .optional()
        .or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfilePageClient() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading, isAuthor, isAdmin } = useAuth();
    const { data: profile, isLoading: profileLoading } = useProfile();
    const updateProfile = useUpdateProfile();
    const [isEditing, setIsEditing] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: profile?.name || "",
            bio: profile?.profile?.bio || "",
            website: profile?.profile?.website || "",
        },
    });

    // Reset form when profile data loads
    const handleEditClick = () => {
        reset({
            name: profile?.name || "",
            bio: profile?.profile?.bio || "",
            website: profile?.profile?.website || "",
        });
        setIsEditing(true);
    };

    const onSubmit = async (data: ProfileFormData) => {
        try {
            await updateProfile.mutateAsync({
                name: data.name,
                bio: data.bio || null,
                website: data.website || null,
            });
            toast.success("Profile updated successfully");
            setIsEditing(false);
        } catch (error) {
            toast.error("Failed to update profile");
            console.error("Profile update error:", error);
        }
    };

    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
        router.push("/login");
        return null;
    }

    const isLoading = authLoading || profileLoading;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case "ADMIN":
                return "default";
            case "AUTHOR":
                return "secondary";
            default:
                return "outline";
        }
    };

    const getRoleBadgeClass = (role: string) => {
        if (role === "ADMIN") return "bg-amber-500 hover:bg-amber-600";
        return "";
    };

    return (
        <div className="bg-background min-h-screen">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <div className="mx-auto max-w-3xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your account settings and profile information
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="h-20 w-20 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-6 w-40" />
                                            <Skeleton className="h-4 w-60" />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : profile ? (
                        <div className="space-y-6">
                            {/* Profile Card */}
                            <Card>
                                <CardHeader>
                                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-20 w-20">
                                                <AvatarImage
                                                    src={profile.image || undefined}
                                                    alt={profile.name || "User"}
                                                />
                                                <AvatarFallback className="text-2xl">
                                                    {profile.name?.[0] || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h2 className="text-xl font-semibold">
                                                        {profile.name || "Unnamed User"}
                                                    </h2>
                                                    <Badge
                                                        variant={getRoleBadgeVariant(profile.role)}
                                                        className={getRoleBadgeClass(profile.role)}
                                                    >
                                                        {profile.role}
                                                    </Badge>
                                                </div>
                                                <p className="text-muted-foreground text-sm">
                                                    {profile.email}
                                                </p>
                                                <div className="mt-1 flex items-center gap-1 text-sm">
                                                    {profile.emailVerified ? (
                                                        <>
                                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                                            <span className="text-green-600">Email verified</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="h-4 w-4 text-amber-500" />
                                                            <span className="text-amber-600">Email not verified</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {!isEditing && (
                                            <Button onClick={handleEditClick}>Edit Profile</Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {isEditing ? (
                                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Name</Label>
                                                <div className="relative">
                                                    <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                                    <Input
                                                        id="name"
                                                        placeholder="Your name"
                                                        className="pl-10"
                                                        {...register("name")}
                                                    />
                                                </div>
                                                {errors.name && (
                                                    <p className="text-destructive text-sm">
                                                        {errors.name.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="bio">Bio</Label>
                                                <Textarea
                                                    id="bio"
                                                    placeholder="Tell us about yourself..."
                                                    className="min-h-[100px] resize-none"
                                                    {...register("bio")}
                                                />
                                                {errors.bio && (
                                                    <p className="text-destructive text-sm">
                                                        {errors.bio.message}
                                                    </p>
                                                )}
                                                <p className="text-muted-foreground text-xs">
                                                    Maximum 500 characters
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="website">Website</Label>
                                                <div className="relative">
                                                    <Globe className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                                    <Input
                                                        id="website"
                                                        placeholder="https://yourwebsite.com"
                                                        className="pl-10"
                                                        {...register("website")}
                                                    />
                                                </div>
                                                {errors.website && (
                                                    <p className="text-destructive text-sm">
                                                        {errors.website.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex gap-2 pt-4">
                                                <Button
                                                    type="submit"
                                                    disabled={updateProfile.isPending}
                                                >
                                                    {updateProfile.isPending ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        "Save Changes"
                                                    )}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setIsEditing(false)}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="space-y-4">
                                            {profile.profile?.bio ? (
                                                <div>
                                                    <h3 className="text-muted-foreground mb-1 text-sm font-medium">
                                                        Bio
                                                    </h3>
                                                    <p className="text-sm">{profile.profile.bio}</p>
                                                </div>
                                            ) : (
                                                <p className="text-muted-foreground text-sm italic">
                                                    No bio added yet. Click &quot;Edit Profile&quot; to add one.
                                                </p>
                                            )}

                                            {profile.profile?.website && (
                                                <div>
                                                    <h3 className="text-muted-foreground mb-1 text-sm font-medium">
                                                        Website
                                                    </h3>
                                                    <a
                                                        href={profile.profile.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary inline-flex items-center gap-1 text-sm hover:underline"
                                                    >
                                                        {profile.profile.website}
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Stats Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Activity</CardTitle>
                                    <CardDescription>Your contributions to TechBlog</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 sm:grid-cols-3">
                                        <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-4">
                                            <div className="bg-primary/10 rounded-full p-2">
                                                <FileText className="text-primary h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold">
                                                    {profile._count.posts}
                                                </p>
                                                <p className="text-muted-foreground text-sm">
                                                    Posts
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-4">
                                            <div className="bg-primary/10 rounded-full p-2">
                                                <MessageSquare className="text-primary h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold">
                                                    {profile._count.comments}
                                                </p>
                                                <p className="text-muted-foreground text-sm">
                                                    Comments
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-4">
                                            <div className="bg-primary/10 rounded-full p-2">
                                                <Calendar className="text-primary h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {formatDate(profile.createdAt)}
                                                </p>
                                                <p className="text-muted-foreground text-sm">
                                                    Member since
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Links Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Quick Links</CardTitle>
                                    <CardDescription>Navigate to your areas</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {isAuthor && (
                                            <Button variant="outline" asChild>
                                                <Link href="/dashboard">
                                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                                    Dashboard
                                                </Link>
                                            </Button>
                                        )}
                                        {isAdmin && (
                                            <Button
                                                variant="outline"
                                                asChild
                                                className="border-amber-500/50 text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:border-amber-500/30 dark:text-amber-500 dark:hover:bg-amber-950 dark:hover:text-amber-400"
                                            >
                                                <Link href="/admin">
                                                    <Shield className="mr-2 h-4 w-4" />
                                                    Admin Panel
                                                </Link>
                                            </Button>
                                        )}
                                        <Button variant="outline" asChild>
                                            <Link href="/posts">
                                                <FileText className="mr-2 h-4 w-4" />
                                                Browse Posts
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-8 text-center">
                                <p className="text-muted-foreground">
                                    Unable to load profile. Please try again later.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
