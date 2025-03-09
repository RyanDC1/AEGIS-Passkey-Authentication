'use client'

import React from 'react'
import MainLayout from '../layouts/MainLayout'
import { Card, Flex, Space, Typography } from 'antd'
import Image from 'next/image'

type Props = {
    user: {
        username: string,
        id: string
    }
}

export default function HomePage({ user }: Props) {
    return (
        <MainLayout
            user={user}
        >
            <Card
                cover={
                    <Image 
                        layout='responsive'
                        width={732}
                        height={636}
                        src='/images/LOGIN_SUCCESS.svg' 
                        alt='login-success' 
                    />
                }
            >
                <div>
                    <Typography.Title level={2} style={{ margin: 0 }}>
                        Welcome {user.username},
                    </Typography.Title>
                </div>
                <div>
                    <Typography.Title level={2} style={{ marginTop: 8 }}>
                        To The World of Passkeys
                    </Typography.Title>
                </div>
                <div className='card-description'>
                    <Typography.Paragraph>
                        You have successfully signed in using a passkey, which is an alternative to passwords.
                        The passkey is stored on your registered device, you can use it to login at any time.
                    </Typography.Paragraph>
                    <Typography.Paragraph>
                        You can register as many passkeys for your current username as you desire and even create passkeys
                        for your account across multiple devices!.
                        Passkeys allow authentication using your registered device authentication such as a pin or a fingerprint scan,
                        alleviating the users need to remember multiple unique passwords.
                    </Typography.Paragraph>
                    <Typography.Paragraph type='secondary' italic>
                        Note: In a real-world application we would use an emailId as a user name and verify 
                        the users identity for every passkey registration
                    </Typography.Paragraph>
                </div>
            </Card>
        </MainLayout>
    )
}