import { NextRequest, NextResponse } from "next/server"

const API_BASE = process.env.API_BASE_URL

export async function GET(req: NextRequest) {
    if (!API_BASE) {
        return NextResponse.json({ message: "API_BASE_URL is not configured" }, { status: 500 })
    }
    try {
        const d = new Date()
        const defaultDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
        const date = req.nextUrl.searchParams.get("date") ?? defaultDate
        const auth = req.headers.get("Authorization") ?? ""
        const res = await fetch(`${API_BASE}/api/v1/assignments?date=${date}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", ...(auth ? { Authorization: auth } : {}) },
        })

        const data = await res.json()

        if (!res.ok) {
            const raw = data?.message
            const message =
                (typeof raw === "object" ? raw?.message : raw) ||
                data?.errors?.[0] ||
                "Failed to fetch assignments"
            return NextResponse.json({ message }, { status: res.status })
        }

        return NextResponse.json(data, { status: 200 })
    } catch {
        return NextResponse.json(
            { message: "Failed to connect to assignments server" },
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
        const res = await fetch(`${API_BASE}/api/v1/assignments/assign`, {
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
                "Failed to create assignment"
            return NextResponse.json({ message }, { status: res.status })
        }

        return NextResponse.json(data, { status: 201 })
    } catch {
        return NextResponse.json(
            { message: "Failed to connect to assignments server" },
            { status: 502 }
        )
    }
}

export async function DELETE(req: NextRequest) {
    if (!API_BASE) {
        return NextResponse.json({ message: "API_BASE_URL is not configured" }, { status: 500 })
    }
    try {
        const body = await req.json()
        const auth = req.headers.get("Authorization") ?? ""
        const res = await fetch(`${API_BASE}/api/v1/assignments/unassign`, {
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
                "Failed to unassign staff"
            return NextResponse.json({ message }, { status: res.status })
        }

        return NextResponse.json(data, { status: 200 })
    } catch {
        return NextResponse.json(
            { message: "Failed to connect to unassign server" },
            { status: 502 }
        )
    }
}

