import React, { useState } from 'react'
import HelpLayout from '../layouts/HelpLayout'
import { FloatButton } from 'antd'
import { QuestionOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { APP_ROUTES } from '@/utils/constants'

export default function LoginHelp() {

    const [showHelp, setShowHelp] = useState(false)

    return (
        <>
            <HelpLayout
                imgSrc='/images/LOGIN_HELP.svg'
                open={showHelp}
                onCancel={() => {
                    setShowHelp(false)
                }}
                content={(
                    <ul>
                        <li><b>New User?:</b> Head over to the <Link href={APP_ROUTES.register}>register page</Link> and create a passkey, it's simple!</li>
                        <li><b>Passkeys:</b> Passkeys are a modern way to log in securely. They're stored directly on your device, so you don't have to remember complicated passwords.</li>
                        <li><b>Existing User?:</b> Once you enter you user name you will be prompted to login via your existing device authentication method.</li>
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