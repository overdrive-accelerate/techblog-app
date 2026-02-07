export type Role = "READER" | "AUTHOR" | "ADMIN";

export interface User {
    id: string;
    email: string;
    name: string;
    image?: string | null;
    role: Role;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Session {
    session: {
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string;
        userAgent?: string;
    };
    user: User;
}
