'use client'

import { logout } from '@/actions/authActions/authActions'
import { APP_ROUTES } from '@/utils/constants'
import { LoadingOutlined } from '@ant-design/icons'
import { Card, Flex, Space, Spin, Typography } from 'antd'
import { useRouter } from '@/contexts'
import React, { useEffect } from 'react'

export default function page() {

    const router = useRouter()

    useEffect(() => {
        logout()
        .then(() => {
            router.push(APP_ROUTES.login)
        })
    }, [])

    return (
        <Card
            style={{
                transform: 'translate(0, 50%)',
                margin: '0 calc(100vw - 80%)',
                boxShadow: '0px 0px 9px 2px #d1d1d157'
            }}
        >
            <Flex justify='center' wrap>
                <Space>
                    <Spin indicator={<LoadingOutlined style={{ top: 6 }}/>} />
                    <Typography.Title level={4}>
                        Logging you out
                    </Typography.Title>
                </Space>
                <img width='50%' src='/images/LOGING_OUT.svg' alt='logout'/>
            </Flex>
        </Card>
    )
}