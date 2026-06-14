import type { AuthUser } from "@/store/authStore"

/** Returns true when the user holds the ROLE_ADMIN authority. */
export const isAdmin = (user: AuthUser | null | undefined): boolean =>
    user?.roles?.some((r) => r.name === "ROLE_ADMIN") ?? false

