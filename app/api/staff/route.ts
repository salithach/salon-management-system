import { NextRequest, NextResponse } from "next/server"

const API_BASE = process.env.API_BASE_URL

export async function GET(req: NextRequest) {
    if (!API_BASE) {
        return NextResponse.json({ message: "API_BASE_URL is not configured" }, { status: 500 })
    }
    try {
        const auth = req.headers.get("Authorization") ?? ""
        const res = await fetch(`${API_BASE}/api/v1/staff`, {
            method: "GET",
            headers: { "Content-Type": "application/json", ...(auth ? { Authorization: auth } : {}) },
        })

        const data = await res.json()

        if (!res.ok) {
            const raw = data?.errors[0]?.message
            const message =
                (typeof raw === "object" ? raw?.message : raw) ||
                data?.errors?.[0] ||
                "Failed to fetch staff"
            return NextResponse.json({ message }, { status: res.status })
        }

        return NextResponse.json(data, { status: 200 })
    } catch {
        return NextResponse.json(
            { message: "Failed to connect to staff server" },
            { status: 502 }
        )
    }
}

export async function POST(req: NextRequest) {
    if (!API_BASE) {
        return NextResponse.json({ message: "API_BASE_URL is not configured" }, { status: 500 })
    }
    try {
        const body = await req.json()
        const auth = req.headers.get("Authorization") ?? ""
        const res = await fetch(`${API_BASE}/api/v1/staff`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...(auth ? { Authorization: auth } : {}) },
            body: JSON.stringify(body),
        })

        const data = await res.json()

        if (!res.ok) {
            const raw = data?.errors[0]?.message
            const message =
                (typeof raw === "object" ? raw?.message : raw) ||
                data?.errors?.[0] ||
                "Failed to create staff member"
            return NextResponse.json({ message }, { status: res.status })
        }

        return NextResponse.json(data, { status: 201 })
    } catch {
        return NextResponse.json(
            { message: "Failed to connect to staff server" },
            { status: 502 }
        )
    }
}

