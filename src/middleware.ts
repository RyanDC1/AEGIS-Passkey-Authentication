import { NextResponse, type NextRequest } from 'next/server'
import { API_ROUTES, APP_ROUTES, Cookie } from './utils/constants'
import { AuthSession } from './models'
import { decrypt } from './actions/commonActions'

export const config = {
    matcher: [`/((?!api|_next/static|_next/image|.*\\/api|.*\\.png$|.*\\.jpg$|.*\\.ico$|.*\\.svg$).*)`]
}

const anonymousRoutes = [
    APP_ROUTES.login,
    APP_ROUTES.register,
    APP_ROUTES.logout
]

const validateAuthSession = async (request: NextRequest) => {
    let sessionCookie = request.cookies.get(Cookie.AUTH_SESSION)?.value

    const response = await fetch(API_ROUTES.validateSession, {
        method: 'POST',
        body: JSON.stringify(sessionCookie ?? ''),
        cache: 'no-store'
    })

    const isValidSession = await response.json()
    return isValidSession
}

export async function middleware(request: NextRequest) {
    if(!anonymousRoutes.includes(request.nextUrl.pathname)) {
        const isValidSession = await validateAuthSession(request)
        
        if(!isValidSession) {
            const redirectUrl = new URL(APP_ROUTES.login, process.env.ALLOWED_ORIGIN)
            if(request.nextUrl.pathname !== APP_ROUTES.home) {
                redirectUrl.searchParams.set('returnUrl', request.nextUrl.pathname)
            }
            return NextResponse.redirect(redirectUrl)
        } 
    }
    else if(request.nextUrl.pathname === APP_ROUTES.login) {
        const isValidSession = await validateAuthSession(request)

        if(isValidSession) {
            return NextResponse.redirect(new URL(APP_ROUTES.home, process.env.ALLOWED_ORIGIN))
        }
    }
}

