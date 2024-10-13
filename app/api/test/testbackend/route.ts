import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const response = await fetch("https://flatbuddy-backend.vercel.app/api/health");
        const data = await response.json();
        return NextResponse.json({ status: "flatbuddy-backend is Up and Running", data });
    } catch (error) {
        return NextResponse.json({ status: "Down" }, { status: 500 });
    }
}