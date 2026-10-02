import { useAuthStore } from "@/store/authStore"

/**
 * Clears auth state and redirects to /login.
 * Called whenever any API returns a 401 (expired/invalid token).
 */
export function handle401(): never {
    useAuthStore.getState().logout()
    if (typeof window !== "undefined") {
        window.location.href = "/login"
    }
    throw new Error("Session expired. Please log in again.")
}

/**
 * Drop-in replacement for `fetch` that automatically handles 401 responses.
 * 401 it clears the auth store and redirects to /login.
 */
export async function apiFetch(
    input: RequestInfo | URL,
    init?: RequestInit
): Promise<Response> {
    const res = await fetch(input, init)

    if (res.status === 401) {
        // Response shape: { data: null, errors: [{ code: 401, message: "..." }] }
        const body = await res.json().catch(() => ({}))
        const msg: string =
            body?.errors?.[0]?.message ??
            body?.message ??
            "Session expired. Please log in again."
        console.warn("[apiFetch] 401 received:", msg)
        handle401()
    }
    return res
}

/**
 * Safely returns a YYYY-MM-DD date string representing local time instead of UTC to avoid timezone date drift.
 */
export function getLocalDateString(d: Date = new Date()): string {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}
