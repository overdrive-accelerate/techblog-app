# Blog App

A modern, full-featured technical blogging platform built with Next.js 16, featuring role-based access control, content management, and administrative controls.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Authentication](#authentication)
- [API Integration](#api-integration)
- [Development](#development)
- [Deployment](#deployment)

## Overview

The Blog App is a comprehensive content management system that enables authors to create and manage posts while administrators oversee content moderation and platform management. Built with Next.js 16 App Router, it provides a seamless experience for content creators and readers alike.

**Key Highlights:**

- Multi-role system (Admin, Author, Reader)
- Publishing workflow with approval system
- Markdown-based content creation
- Tag-based organization
- Comment system
- Responsive design with dark/light mode

## Features

### Public Features

- **Homepage** with featured posts carousel and recent posts grid
- **Post browsing** with filtering by tags, authors, and search
- **Post reading** with markdown rendering and related posts
- **Tag pages** with descriptions and filtered post listings
- **Author profiles** showcasing published posts
- **Commenting system** on published posts

### Author Dashboard

- Create, edit, and manage posts
- Draft system for work-in-progress content
- Submit posts for admin approval
- Track post status (Draft, Pending, Published, Rejected)
- Manage personal comments

### Admin Panel

- Dashboard with platform statistics
- Review and approve/reject publish requests
- Manage all posts across the platform
- Tag creation and management
- User account and role management
- Comment moderation

### User Features

- Authentication via Better-Auth
- Profile management
- Dark/light theme toggle
- Fully responsive design

## Tech Stack

### Core

- **Next.js 16.1.1** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript 5.9.3** - Type safety

### UI & Styling

- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **next-themes** - Theme management
- **Sonner** - Toast notifications

### Data & State

- **Tanstack/react-query 5.90.20** - Server state management
- **Tanstack/react-table 8.21.3** - Table components
- **React Hook Form 7.71.1** - Form state management

### Validation & Auth

- **Zod 4.3.6** - Schema validation
- **Better-Auth 1.4.17** - Authentication

### Content

- **react-markdown 10.1.0** - Markdown rendering

### Development

- **ESLint** - Code linting
- **Prettier** - Code formatting

## Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm or bun package manager
- Backend API server running (default: `http://localhost:3001`)

### Installation

1. **Install dependencies:**

    ```bash
    pnpm install
    # or
    bun install
    ```

2. **Set up environment variables:**

    Create a `.env.local` file in the root directory:

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3001
    ```

3. **Start the development server:**

    ```bash
    pnpm dev
    # or
    bun dev
    ```

4. **Open your browser:**

    Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
pnpm build
pnpm start

# or

bun run build
bun start
```

## Architecture

### Frontend Architecture

The application follows Next.js 16 App Router patterns:

- **Server Components** - Default rendering for optimal performance
- **Client Components** - Interactive UI marked with `"use client"`
- **Route Groups** - Organized routes using `(auth)` groups
- **Middleware** - Route protection via `proxy.ts`
- **API Client** - Centralized type-safe API communication

### Key Patterns

**Component Organization:**

- `components/` - Reusable UI components
- `components/pages/` - Page-specific client components
- `components/ui/` - Base UI primitives (Radix UI)
- `components/layouts/` - Layout components

**Data Fetching:**

- React Query for server state management
- Custom hooks encapsulate data fetching logic
- Type-safe API client handles all HTTP requests

**State Management:**

- React Query - Server state
- React Hook Form - Form state
- Better-Auth - Authentication state

**Styling:**

- Tailwind CSS v4 for utility-first styling
- Radix UI for accessible components
- Next Themes for theme management

## Authentication

### Authentication Flow

The application uses Better-Auth for authentication:

1. **Sign Up** - Users create accounts via `/signup`
2. **Sign In** - Users authenticate via `/login`
3. **Session Management** - HTTP-only cookies handle sessions
4. **Protected Routes** - Dashboard and admin routes require authentication

### Role-Based Access Control

Three roles are supported:

- **READER** - View posts and comment
- **AUTHOR** - Create posts, manage drafts, submit for approval
- **ADMIN** - Full access including moderation and user management

### Route Protection

Route protection is handled by `proxy.ts` middleware:

- **Public Routes:** `/`, `/login`, `/signup`, `/posts`, `/tags`
- **Protected Routes:** `/dashboard/*`, `/admin/*`
- **Redirects:** Unauthenticated users are redirected to login

### Usage

```typescript
import { useAuth } from "@/hooks/use-auth";

const { user, isAuthenticated, isLoading } = useAuth();
```

## API Integration

### API Client

The application uses a centralized, type-safe API client (`lib/api-client.ts`) that:

- Provides type-safe methods (`get`, `post`, `put`, `patch`, `delete`)
- Handles errors consistently
- Includes credentials for cookie-based auth
- Supports query parameters and FormData uploads

### Configuration

Set the API base URL via environment variable:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Usage Examples

```typescript
import { api } from "@/lib/api-client";

// GET request
const posts = await api.get<PostsResponse>("/posts", {
    params: { page: 1, limit: 10 },
});

// POST request
const newPost = await api.post<Post>("/posts", {
    title: "My Post",
    content: "...",
});

// FormData upload
const uploaded = await api.postFormData("/upload", formData);
```

### Data Fetching Hooks

Custom hooks provide React Query integration:

```typescript
// Fetch posts
const { data, isLoading, error } = usePosts({
    page: 1,
    limit: 10,
    status: "PUBLISHED",
    tagSlug: "react",
});

// Fetch tags
const { data: tags } = useTags();

// Fetch comments
const { data: comments } = useComments(postId);
```

## Development

### Adding a New Page

1. Create a page file in `app/[route]/page.tsx`:

    ```typescript
    import { PageClient } from '@/components/pages/page-client';

    export default function Page() {
      return <PageClient />;
    }
    ```

2. Create the client component in `components/pages/page-client.tsx`:

    ```typescript
    "use client";

    export function PageClient() {
        // Component logic
    }
    ```

### Adding a New Component

Create component file in `components/`:

```typescript
"use client"; // If using hooks or interactivity

interface ComponentProps {
    // Props interface
}

export function Component({ ...props }: ComponentProps) {
    // Component implementation
}
```

### Adding a New Hook

Create a hook file in `hooks/`:

```typescript
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export function useCustomData() {
    return useQuery({
        queryKey: ["custom-data"],
        queryFn: () => api.get("/custom-endpoint"),
    });
}
```

### Form Handling

Use React Hook Form with Zod validation:

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
    title: z.string().min(1),
    content: z.string().min(10),
});

const form = useForm({
    resolver: zodResolver(schema),
});
```

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use Radix UI components for complex UI elements
- Maintain consistent spacing and typography

### Error Handling

- Use React Query's error handling for API errors
- Display user-friendly messages via Sonner toasts
- Implement error boundaries for component-level errors

## Deployment

### Environment Variables

Set the following in your deployment platform:

```env
NEXT_PUBLIC_API_URL=https://your-api-url.com
```

### Build Process

```bash
pnpm build
# or
bun run build
```

This creates an optimized production build in the `.next` directory.

### Production Checklist

- [ ] Set `NEXT_PUBLIC_API_URL` to production API URL
- [ ] Configure CORS on backend API
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Configure analytics (if needed)
- [ ] Set up CDN for static assets
- [ ] Enable HTTPS
- [ ] Configure proper caching headers

### Deployment Platforms

**Vercel (Recommended):**

1. Push code to GitHub
2. Import repository on Vercel
3. Configure environment variables
4. Deploy

The app can also be deployed to any platform supporting Node.js (Netlify, AWS, Docker, etc.).

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Better-Auth Documentation](https://www.better-auth.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)
