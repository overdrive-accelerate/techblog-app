import type { Role } from "./auth";

export interface Author {
    id: string;
    name: string;
    image?: string | null;
    role?: Role;
}

export interface Tag {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
    _count?: {
        posts: number;
    };
}

export interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string | null;
    coverImage?: string | null;
    status: "DRAFT" | "PENDING_APPROVAL" | "PUBLISHED" | "REJECTED";
    views: number;
    isFeatured?: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string | null;
    author: Author;
    tags: Tag[];
    commentsCount?: number;
    comments?: Comment[];
}

export interface PostsResponse {
    posts: Post[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasMore?: boolean;
    };
}

export interface Comment {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    author: Author;
    postId: string;
}

export interface CommentWithPost extends Comment {
    post: {
        id: string;
        title: string;
        slug: string;
        status: string;
    };
}

export interface CommentsResponse {
    comments: Comment[];
}

export interface MyCommentsResponse {
    comments: CommentWithPost[];
}

export interface TagsResponse {
    tags: Tag[];
}

export interface PostFilters {
    page?: number;
    limit?: number;
    search?: string;
    tagSlug?: string;
    authorId?: string;
    status?: string;
    isFeatured?: boolean;
    sortBy?: "createdAt" | "updatedAt" | "viewCount" | "publishedAt" | "title";
    sortOrder?: "asc" | "desc";
}

// User types for admin user management
export interface User {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: "ADMIN" | "AUTHOR" | "READER";
    emailVerified: boolean;
    createdAt: string;
    _count: {
        posts: number;
        comments: number;
    };
}

export interface UserDetail extends User {
    updatedAt: string;
    profile?: {
        bio: string | null;
        website: string | null;
    } | null;
}

export interface UsersResponse {
    users: User[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface UserFilters {
    page?: number;
    limit?: number;
    search?: string;
    role?: "ADMIN" | "AUTHOR" | "READER";
}

// Admin comments types
export interface AllCommentsResponse {
    comments: CommentWithPost[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface CommentFilters {
    page?: number;
    limit?: number;
    search?: string;
    authorId?: string;
    postId?: string;
}
