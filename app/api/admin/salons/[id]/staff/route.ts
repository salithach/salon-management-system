import { NextRequest, NextResponse } from "next/server"

const API_BASE = process.env.API_BASE_URL

export async function GET(req: NextRequest) {
    if (!API_BASE) return NextResponse.json({ message: "API_BASE_URL not configured" }, { status: 500 })
    try {
        const auth = req.headers.get("Authorization") ?? ""
        const res = await fetch(`${API_BASE}/api/v1/staff`, {
            headers: { "Content-Type": "application/json", ...(auth ? { Authorization: auth } : {}) },
        })
        const data = await res.json()
        if (!res.ok) {
            const msg = data?.errors?.[0]?.message || data?.message || "Failed to fetch staff"
            return NextResponse.json({ message: msg }, { status: res.status })
        }
        return NextResponse.json(data, { status: 200 })
    } catch {
        return NextResponse.json({ message: "Failed to connect to API server" }, { status: 502 })
    }
}

