import React, { useState } from 'react'
import HelpLayout from '../layouts/HelpLayout'
import { FloatButton } from 'antd'
import { QuestionOutlined } from '@ant-design/icons'

export default function RegistrationHelp() {

    const [showHelp, setShowHelp] = useState(false)

    return (
        <>
            <HelpLayout
                imgSrc='/images/REGISTER_HELP.svg'
                open={showHelp}
                onCancel={() => {
                    setShowHelp(false)
                }}
                content={(
                    <ul>
                        <li><b>Username:</b> Your username can be anything you like. Usernames are case-insensitive</li>
                        <li><b>Passkeys:</b> Passkeys are a modern way to log in securely. They're stored directly on your device, so you don't have to remember complicated passwords.</li>
                        <li><b>Existing User?:</b> If you add an existing username, you will be prompted to register a new passkey apart from your existing one.</li>
                        <li><b>New User?:</b> If you are registering for the first time, you will be prompted to create a new passkey.</li>
                        <li><b>Registration:</b> Simply login using the existing method you use on this device.</li>
                        <li><b>All set:</b> Once you've successfully registered, you'll be taken to the login page, where you can use your passkey to access your account.</li>
                    </ul>
                )}
            />

            <FloatButton
                icon={<QuestionOutlined />}
                onClick={() => {
                    setShowHelp(true)
                }}
            />
        </>
    )
}