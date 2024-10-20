'use server'

import { connectToDB } from "@/db"
import { userModel } from "@/db/schema"
import { generateAuthenticationOptions, generateRegistrationOptions, verifyAuthenticationResponse, verifyRegistrationResponse } from '@simplewebauthn/server'
import { AuthenticationResponseJSON, RegistrationResponseJSON } from '@simplewebauthn/types'
import { cookies } from "next/headers"
import { decrypt, encrypt, getHostName } from "../commonActions"
import { AuthenticationSession, AuthSession, Passkeys, RegistrationSession } from "@/models"
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies"
import { Cookie } from "@/utils/constants"
import { serverError } from "@/utils/helpers"
import dayjs from "dayjs"

const cookieOptions: Partial<ResponseCookie> = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
}

export async function register(username: string) {
    await connectToDB()

    const response = await userModel.findOne({ 
        normalizedUsername: username.trim().toUpperCase() 
    }) || new userModel({
        username,
        normalizedUsername: username.trim().toUpperCase() 
    })

    const user = response.toJSON()

    const hostName = await getHostName()
    const options = await generateRegistrationOptions({
        // relying party (app) name and id
        rpName: 'aegis-auth',
        rpID: hostName,
        userName: user.username,
        timeout: 300000,
        userDisplayName: user.username,
        // exclude existing passkeys
        excludeCredentials: user.passkeys.map(passkey => ({
            id: passkey.id
        })),
        authenticatorSelection: {
            // allows browser to register new keys
            residentKey: 'discouraged',
        }
    })

    const session: RegistrationSession = {
        options,
        user: {
            id: user.id,
            username: user.username
        }
    }

    // store the challenge and user session to be used in the 
    // verifyRegistration call
    const sessionData = await encrypt(session)
    cookies().set(Cookie.REGISTRATION_SESSION, sessionData, cookieOptions)

    return options
}

/**
 * Verify the registration
 */
export async function verifyRegistration(response: RegistrationResponseJSON) {

    const sessionCookie = cookies().get(Cookie.REGISTRATION_SESSION)?.value!
    const session = await decrypt<RegistrationSession>(sessionCookie)

    // verify the signed challenge returned by the browser
    const verification = await verifyRegistrationResponse({
        response,
        expectedChallenge: session.options.challenge,
        expectedOrigin: process.env.ALLOWED_ORIGIN,
        expectedRPID: session.options.rp.id,
        requireUserVerification: false
    })

    const { verified, registrationInfo } = verification

    if (verified && registrationInfo) {
        // if verified, update the passkeys
        await connectToDB()

        const user = await userModel.findById(session.user.id)
        const passkeys: Passkeys[] = user?.passkeys || []
        if (!passkeys.some(s => s.id == registrationInfo?.credentialID)) {
            const updatedPasskeys = passkeys.concat({
                counter: registrationInfo?.counter,
                id: registrationInfo.credentialID,
                backedUp: registrationInfo.credentialBackedUp,
                webAuthnUserID: session.user.id,
                deviceType: registrationInfo.credentialDeviceType,
                transports: response.response.transports ?? [],
                credentialPublicKey: registrationInfo.credentialPublicKey,
            })
            
            userModel.collection.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 })
            // Expire in 1 month
            const expirationTime = dayjs().add(1, 'month').toDate()

            await userModel.updateOne(
                { _id: session.user.id },
                {
                    $set: {
                        username: session.user.username,
                        passkeys: updatedPasskeys,
                        expiresAt: expirationTime
                    },
                    $setOnInsert: {
                        normalizedUsername: session.user.username.trim().toUpperCase(),
                    }
                },
                {
                    // create new user if absent
                    upsert: true,
                }
            )

            cookies().delete(Cookie.REGISTRATION_SESSION)
        }
        else {
            throw serverError('Duplicate passkey')
        }
    }
    else {
        throw serverError('Verification Failed, please try again')
    }
}

export async function login(username: string) {
    await connectToDB()

    const response = await userModel.findOne({ 
        normalizedUsername: username.trim().toUpperCase() 
    })

    if (!response) {
        throw serverError('User not registered', {
            property: 'userName'
        })
    }

    const user = response.toJSON()

    const hostName = await getHostName()
    const options = await generateAuthenticationOptions({
        rpID: hostName,
        timeout: 300000,
        // Require users to use a previously-registered authenticator
        allowCredentials: user.passkeys.map(passkey => ({
            id: passkey.id,
            transports: passkey.transports
        })),
    })

    const session: AuthenticationSession = {
        options,
        user: {
            id: user.id,
            username: user.username
        }
    }

    // store the challenge and user session to be used in the 
    // verifyLogin call
    const sessionData = await encrypt(session)
    cookies().set(Cookie.LOGIN_SESSION, sessionData, cookieOptions)

    return options
}

/**
 * Verify login
 */
export async function verifyLogin(response: AuthenticationResponseJSON) {

    const sessionCookie = cookies().get(Cookie.LOGIN_SESSION)?.value!
    const session = await decrypt<AuthenticationSession>(sessionCookie)

    await connectToDB()

    const userResponse = await userModel.findById(session.user.id)

    if (!userResponse) {
        throw serverError('Invalid User')
    }

    const user = userResponse.toJSON()

    // check if the passkey used to login exists in the db
    const passkey = user.passkeys.find(s => s.id === response.id)

    if (!passkey) {
        throw serverError('Invalid Credentials')
    }

    // verify the signed challenge returned by the browser
    const verification = await verifyAuthenticationResponse({
        response,
        expectedChallenge: session.options.challenge,
        expectedOrigin: process.env.ALLOWED_ORIGIN,
        expectedRPID: session.options.rpId!,
        requireUserVerification: false,
        authenticator: {
            credentialID: passkey.id,
            counter: passkey.counter,
            credentialPublicKey: new Uint8Array(passkey.credentialPublicKey.buffer),
            transports: passkey.transports
        }
    })

    const { verified, authenticationInfo } = verification

    if (verified && authenticationInfo) {
        // if verified, update the passkey counter
        const passkeys: Passkeys[] = user?.passkeys || []


        const updatedPasskey: Passkeys = {
            ...passkey,
            counter: authenticationInfo.newCounter
        }

        const updatedPasskeys = passkeys.map(key => {
            if (key.id === updatedPasskey.id) {
                return updatedPasskey
            }
            return key
        })

        await userModel.updateOne(
            { _id: session.user.id },
            {
                $set: {
                    username: session.user.username,
                    passkeys: updatedPasskeys
                }
            }
        )

        cookies().delete(Cookie.LOGIN_SESSION)

        const authSession = await encrypt({
            user: session.user
        } as AuthSession)
        cookies().set(Cookie.AUTH_SESSION, authSession, cookieOptions)
    }
    else {
        throw serverError('Verification Failed, please try again')
    }
}

export async function isSessionValid(session: string) {
    const authSession = await decrypt<AuthSession>(session)
    return !!authSession?.user?.id
}

export async function getUser() {
    const session = cookies().get(Cookie.AUTH_SESSION)?.value!
    const authSession = await decrypt<AuthSession>(session)
    return authSession.user
}

export async function logout() {
    cookies().delete(Cookie.AUTH_SESSION)
}