import { AuthenticatorTransportFuture, CredentialDeviceType } from "@simplewebauthn/types"

export interface User {
    username: string,
    id: string,
    passkeys: Passkeys[]
}

export interface Passkeys {
    id: string,
    transports: AuthenticatorTransportFuture[]
    counter: number,
    backedUp: boolean,
    webAuthnUserID: string,
    deviceType: CredentialDeviceType,
    credentialPublicKey: Uint8Array,
}