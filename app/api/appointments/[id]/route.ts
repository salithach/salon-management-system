import { NextRequest, NextResponse } from "next/server"

const API_BASE = process.env.API_BASE_URL

function extractMessage(data: Record<string, unknown>, fallback: string): string {
    const raw = data?.message
    return (typeof raw === "object" ? (raw as Record<string, string>)?.message : raw as string)
        || (data?.errors as { message: string }[])?.[0]?.message
        || fallback
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!API_BASE) {
        return NextResponse.json({ message: "API_BASE_URL is not configured" }, { status: 500 })
    }
    try {
        const { id } = await params
        const body = await req.json()
        const auth = req.headers.get("Authorization") ?? ""

        const res = await fetch(`${API_BASE}/api/v1/appointments/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", ...(auth ? { Authorization: auth } : {}) },
            body: JSON.stringify(body),
        })

        const data = await res.json()

        if (!res.ok) {
            return NextResponse.json({ message: extractMessage(data, "Failed to update appointment") }, { status: res.status })
        }

        return NextResponse.json(data, { status: 200 })
    } catch {
        return NextResponse.json({ message: "Failed to connect to appointments server" }, { status: 502 })
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!API_BASE) {
        return NextResponse.json({ message: "API_BASE_URL is not configured" }, { status: 500 })
    }
    try {
        const { id } = await params
        const auth = req.headers.get("Authorization") ?? ""

        const res = await fetch(`${API_BASE}/api/v1/appointments/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", ...(auth ? { Authorization: auth } : {}) },
        })

        if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            return NextResponse.json({ message: extractMessage(data, "Failed to delete appointment") }, { status: res.status })
        }

        return new NextResponse(null, { status: 204 })
    } catch {
        return NextResponse.json({ message: "Failed to connect to appointments server" }, { status: 502 })
    }
}

