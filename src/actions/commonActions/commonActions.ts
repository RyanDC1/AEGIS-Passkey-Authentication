import { headers } from "next/headers";

export async function getHostName() {
    return process.env.NODE_ENV === 'development' ? 
    'localhost' 
    : 
    headers().get('host')!
}