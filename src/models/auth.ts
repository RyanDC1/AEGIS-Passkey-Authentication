import { PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/types";
import { User } from "./user";

export interface RegistrationSession {
    user: Omit<User, 'passkeys'>,
    options: PublicKeyCredentialCreationOptionsJSON
}

export interface AuthenticationSession {
    user: Omit<User, 'passkeys'>,
    options: PublicKeyCredentialRequestOptionsJSON
}

export interface AuthSession {
    user: Omit<User, 'passkeys'>
}

export interface LoginResponse {
    isValid: boolean,
    challenge: PublicKeyCredentialRequestOptionsJSON | null,
    error?: string
}