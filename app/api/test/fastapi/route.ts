import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const response = await fetch("http://127.0.0.1:8000");
        const data = await response.json();
        return NextResponse.json({ status: "fastapi is Up and Running", data });
    } catch (error) {
        return NextResponse.json({ status: "Down" }, { status: 500 });
    }
}