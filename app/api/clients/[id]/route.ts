import { NextRequest, NextResponse } from "next/server"

const API_BASE = process.env.API_BASE_URL

type Params = { params: Promise<{ id: string }> }

export async function DELETE(req: NextRequest, { params }: Params) {
    if (!API_BASE) {
        return NextResponse.json({ message: "API_BASE_URL is not configured" }, { status: 500 })
    }
    const { id } = await params
    try {
        const url  = `${API_BASE}/api/v1/clients/${id}`
        const auth = req.headers.get("Authorization") ?? ""
        const res = await fetch(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", ...(auth ? { Authorization: auth } : {}) },
        })

        const data = await res.json()

        if (!res.ok) {
            const raw     = data?.message
            const message = (typeof raw === "object" ? raw?.message : raw)
                || data?.errors?.[0]?.message
                || "Failed to delete client"
            return NextResponse.json({ message }, { status: res.status })
        }

        return NextResponse.json(data, { status: 200 })
    } catch {
        return NextResponse.json({ message: "Failed to connect to clients server" }, { status: 502 })
    }
}

