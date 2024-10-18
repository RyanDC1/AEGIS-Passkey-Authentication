import { isSessionValid } from "@/actions/authActions"
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    if(request.method !== 'POST') {
       return NextResponse.json('Method Not Allowed', { status: 405 });
    }
    const session = await request.json()

    const isValid = await isSessionValid(session)

    return NextResponse.json(isValid, { status: 200 })
}