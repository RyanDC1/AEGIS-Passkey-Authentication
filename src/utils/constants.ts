export const APP_ROUTES = {
    home: '/',
    login: '/login',
    register: '/register',
    logout: '/logout'
}

export const Cookie = {
    REGISTRATION_SESSION: 'registration-session',
    LOGIN_SESSION: 'login-session',
    AUTH_SESSION: 'auth-session'
}

const host = process.env.ALLOWED_ORIGIN

export const API_ROUTES = {
    validateSession: `${host}/auth/api/validate-session`
}