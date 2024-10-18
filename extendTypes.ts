declare namespace NodeJS {
    export interface ProcessEnv {
        MONGO_DB_URI: string
        AES_SECRET: string
        ALLOWED_ORIGIN: string
    }
}