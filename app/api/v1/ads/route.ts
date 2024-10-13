import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const response = await fetch('http://localhost:3000/api/ads');
        const data = await response.json();
        return NextResponse.json({ status: "Success", data: data });
    } catch (error) {
        return NextResponse.json({ status: "Down", error }, { status: 500 });
    }
}

export async function POST(request: Request) {

    try {
        const body = await request.json();
        const userId = body.userId;
        const newBody = {
            "userId": userId,
            "title": "something good",
            "description": "something better than good",
            "location": "near vikhroli",
            "photos": ["https://google.com/hello.png"],
            "rent": 3444,
            "lookingFor": "male",
            "occupancyType": "shared",
            "features": ["nice", "food"],
            "amenities": ["FRIDGE", "WASHING_MACHINE"],
            "preferences": ["NIGHT_OWL", "CLEAN"]
        };
        const response = await fetch('http://localhost:3000/api/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newBody),
        });
        const data = await response.json();
        console.log(data);
        return NextResponse.json({ status: "Success" });
    } catch (error) {
        return NextResponse.json({ status: "Error", error }, { status: 500 });
    }
}