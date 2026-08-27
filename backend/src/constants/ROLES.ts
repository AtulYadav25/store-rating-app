export const ROLES = {
    USER: "user",
    ADMIN: "admin",
    STORE_OWNER: "store_owner"
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];
