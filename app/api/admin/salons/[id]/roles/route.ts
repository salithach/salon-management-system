import { NextRequest, NextResponse } from "next/server"
import { CONTENT_TYPES, REQUEST_HEADERS } from "@/lib/constants"

const API_BASE = process.env.API_BASE_URL

export async function GET(req: NextRequest) {
    if (!API_BASE) return NextResponse.json({ message: "API_BASE_URL not configured" }, { status: 500 })
    try {
        const auth     = req.headers.get(REQUEST_HEADERS.AUTHORIZATION) ?? ""
        const tenantId = req.headers.get(REQUEST_HEADERS.TENANT_ID) ?? ""
        const res = await fetch(`${API_BASE}/api/v1/metadata/jobRoles`, {
            headers: {
                [REQUEST_HEADERS.CONTENT_TYPE]: CONTENT_TYPES.JSON,
                ...(auth     ? { [REQUEST_HEADERS.AUTHORIZATION]: auth }     : {}),
                ...(tenantId ? { [REQUEST_HEADERS.TENANT_ID]:     tenantId } : {}),
            },
        })
        const data = await res.json()
        if (!res.ok) {
            const msg = data?.errors?.[0]?.message || data?.message || "Failed to fetch roles"
            return NextResponse.json({ message: msg }, { status: res.status })
        }
        return NextResponse.json(data, { status: 200 })
    } catch {
        return NextResponse.json({ message: "Failed to connect to API server" }, { status: 502 })
    }
}

export async function POST(req: NextRequest) {
    if (!API_BASE) return NextResponse.json({ message: "API_BASE_URL not configured" }, { status: 500 })
    try {
        const body     = await req.json()
        const auth     = req.headers.get(REQUEST_HEADERS.AUTHORIZATION) ?? ""
        const tenantId = req.headers.get(REQUEST_HEADERS.TENANT_ID) ?? ""
        const res = await fetch(`${API_BASE}/api/v1/metadata/jobRoles`, {
            method: "POST",
            headers: {
                [REQUEST_HEADERS.CONTENT_TYPE]: CONTENT_TYPES.JSON,
                ...(auth     ? { [REQUEST_HEADERS.AUTHORIZATION]: auth }     : {}),
                ...(tenantId ? { [REQUEST_HEADERS.TENANT_ID]:     tenantId } : {}),
            },
            body: JSON.stringify(body),
        })
        const data = await res.json()
        if (!res.ok) {
            const msg = data?.errors?.[0]?.message || data?.message || "Failed to add role"
            return NextResponse.json({ message: msg }, { status: res.status })
        }
        return NextResponse.json(data, { status: 201 })
    } catch {
        return NextResponse.json({ message: "Failed to connect to API server" }, { status: 502 })
    }
}

