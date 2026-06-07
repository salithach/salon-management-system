import { NextResponse } from "next/server"

const API_BASE = process.env.API_BASE_URL

export async function GET() {
    if (!API_BASE) {
        return NextResponse.json({ message: "API_BASE_URL is not configured" }, { status: 500 })
    }
    try {
        const res = await fetch(`${API_BASE}/api/v1/salons/types`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })

        const data = await res.json()

        if (!res.ok) {
            const raw = data?.errors?.[0]?.message
            const message =
                (typeof raw === "object" ? raw?.message : raw) ||
                data?.message ||
                "Failed to fetch salon types"
            return NextResponse.json({ message }, { status: res.status })
        }

        return NextResponse.json(data, { status: 200 })
    } catch {
        return NextResponse.json(
            { message: "Failed to connect to server" },
            { status: 502 }
        )
    }
}

