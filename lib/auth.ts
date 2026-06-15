import type { AuthUser } from "@/store/authStore"
import {CONTENT_TYPES, REQUEST_HEADERS} from "@/lib/constants";
import {Options} from "@/store/metadataStore";

/** Returns true when the user holds the ROLE_ADMIN authority. */
export const isAdmin = (user: AuthUser | null | undefined): boolean =>
    user?.roles?.some((r) => r.name === "ROLE_ADMIN") ?? false

export const headersWithAuth = (headers: object, tenantId: string, options: Options) => {
    if (isAdmin(options?.user)) {
        return  {
            ...headers,
            [REQUEST_HEADERS.CONTENT_TYPE]: CONTENT_TYPES.JSON,
            ...(tenantId ? { [REQUEST_HEADERS.TENANT_ID]: tenantId } : {}),
        }
    } else {
        return headers
    }
}