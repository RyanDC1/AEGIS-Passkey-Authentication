import { isSessionValid } from "@/actions/authActions"

export async function POST(request: Request) {
    if(request.method !== 'POST') {
       return Response.json('Method Not Allowed', { status: 405 });
    }
    const session = await request.json()

    const isValid = await isSessionValid(session)

    return Response.json(isValid, { status: 200 })
}