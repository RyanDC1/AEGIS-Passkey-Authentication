'use client'

import React from 'react'
import { Card, Typography } from 'antd'
import styles from '@/css/common.module.scss'

type Props = {
    children: React.ReactNode,
    title: string,
    footer?: React.ReactNode
}

export default function SignInLayout(props: Props) {

    const { children, title, footer } = props

    return (
        <div className='sign-in-layout'>
            <Card className='sign-in-card'>
                <img
                    className='logo'
                    src='/images/AEGIS_LOGO_DARK.png'
                    alt='AEGIS_LOGO'
                />
                <Typography.Title 
                    level={2} 
                    className={`header-title ${styles['fontw-700']}`}
                >
                    {title}
                </Typography.Title>
                {children}
            </Card>
            {footer}
        </div>
    )
}