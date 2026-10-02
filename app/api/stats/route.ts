import { NextRequest, NextResponse } from "next/server"

const API_BASE = process.env.API_BASE_URL

export async function GET(req: NextRequest) {
    if (!API_BASE) {
        return NextResponse.json({ message: "API_BASE_URL is not configured" }, { status: 500 })
    }
    try {
        const params = new URLSearchParams()
        for (const key of ["startDate", "endDate"]) {
            const v = req.nextUrl.searchParams.get(key)
            if (v) params.set(key, v)
        }
        const qs = params.toString()
        const auth = req.headers.get("Authorization") ?? ""
        const res = await fetch(`${API_BASE}/api/v1/stats${qs ? `?${qs}` : ""}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(auth ? { Authorization: auth } : {}),
            },
        })
        const data = await res.json()
        if (!res.ok) {
            const raw = data?.errors[0]?.message
            const message = (typeof raw === "object" ? raw?.message : raw) || data?.errors?.[0] || "Failed to fetch jobs"
            return NextResponse.json({ message }, { status: res.status })
        }
        return NextResponse.json(data, { status: res.status })
    } catch (error) {
        return NextResponse.json({ message: "Failed to connect to server" }, { status: 502 })
    }
}