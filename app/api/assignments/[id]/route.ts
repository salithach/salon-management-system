import { NextRequest, NextResponse } from "next/server"

const API_BASE = process.env.API_BASE_URL

const forwardAuth = (req: NextRequest): Record<string, string> => {
    const auth = req.headers.get("Authorization")
    return auth ? { Authorization: auth } : {}
}

type Params = { params: Promise<{ id: string }> }

export async function DELETE(req: NextRequest, { params }: Params) {
    if (!API_BASE) {
        return NextResponse.json({ message: "API_BASE_URL is not configured" }, { status: 500 })
    }
    try {
        const { id } = await params
        const d = new Date()
        const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
        const res = await fetch(`${API_BASE}/api/v1/assignments/${id}?date=${date}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", ...forwardAuth(req) },
        })

        const data = await res.json()

        if (!res.ok) {
            const raw = data?.errors[0]?.message
            const message =
                (typeof raw === "object" ? raw?.message : raw) ||
                data?.errors?.[0] ||
                "Failed to delete daily assignment"
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
