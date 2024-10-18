import { ServerError } from "@/models"

export function serverError(error: string, config: Partial<ServerError> = {}) {
    const serverError: ServerError = {
        message: error,
        ...config
    }
    throw Error(JSON.stringify(serverError))
}

export function getServerError(error: string) : ServerError {
    try {
        return JSON.parse(error) as ServerError
    } catch (error) {
        console.error('Invalid error format')
        return {
            message: ''
        }
    }
}