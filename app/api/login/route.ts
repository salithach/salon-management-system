import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        const res = await fetch("http://localhost:7800/api/v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })

        const data = await res.json()

        if (!res.ok) {
            // Handle nested message object: { message: { code, message } }
            const raw = data?.message
            const message =
                (typeof raw === "object" ? raw?.message : raw) ||
                data?.errors?.[0] ||
                "Login failed"
            return NextResponse.json({ message }, { status: res.status })
        }

        return NextResponse.json(data, { status: 200 })
    } catch {
        return NextResponse.json(
            { message: "Failed to connect to auth server" },
            { status: 502 }
        )
    }
}

