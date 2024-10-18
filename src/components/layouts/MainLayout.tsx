import React, { useMemo } from 'react'
import Link from 'next/link'
import { Button, Dropdown, Flex, Layout, Space, Typography } from 'antd'
import { ItemType } from 'antd/es/menu/interface'
import { KeyOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { APP_ROUTES } from '@/utils/constants'
import styles from '@/css/common.module.scss'
import '@/css/home.scss'

const { Header, Footer, Content } = Layout

type Props = {
    children: React.ReactNode,
    user: {
        username: string,
        id: string
    }
}

export default function MainLayout(props: Props) {

    const { children, user } = props

    const menuItems: ItemType[] = useMemo(() => [
        {
            key: 'register',
            label: (
                <Link href={APP_ROUTES.register}>
                    <Space>
                        <KeyOutlined />
                        <Typography.Text>
                            Register New Passkey
                        </Typography.Text>
                    </Space>
                </Link>
            ),
        },
        {
            key: 'logout',
            label: (
                <Link href={APP_ROUTES.logout}>
                    <Space className={styles['color-error']}>
                        <LogoutOutlined />
                        <Typography.Text className={styles['color-error']}>
                            Logout
                        </Typography.Text>
                    </Space>
                </Link>
            ),
        }
    ], [])

    return (
        <Layout className='main-layout'>
            <Header>
                <Flex align='center' justify='space-between'>
                    <Flex align='end' gap={12}>
                        <img className='logo' src='/images/AEGIS_LOGO_DARK.png' alt='logo' />
                        <Typography.Title level={2} className='header-title'>
                            AEGIS AUTH
                        </Typography.Title>
                    </Flex>
                    <Dropdown
                        menu={{
                            items: menuItems
                        }}
                    >
                        <Button
                            type='text'
                            size='large'
                            icon={<UserOutlined />}
                        >
                            {user.username}
                        </Button>
                    </Dropdown>
                </Flex>
            </Header>
            <Content>
                {children}
            </Content>
        </Layout>
    )
}