'use client'

import React, { useEffect, useState } from 'react'
import { Button, Flex, Form, Input, Typography, message as antMessage } from 'antd'
import SignInLayout from '../layouts/SignInLayout'
import { useRouter } from '@/contexts'
import { APP_ROUTES } from '@/utils/constants'
import { login, verifyLogin } from '@/actions/authActions'
import { startAuthentication } from '@simplewebauthn/browser'
import { getServerError } from '@/utils/helpers'
import { useSearchParams } from 'next/navigation'
import LoginHelp from './LoginHelp'
import { ServerError } from '@/models'


type Props = {}

enum FormNames {
    UserName = 'userName'
}

interface FormValues {
    [FormNames.UserName]: string
}

export default function LoginPage({ }: Props) {

    const [form] = Form.useForm()
    const { validateFields } = form
    const [message, messageContext] = antMessage.useMessage()
    const router = useRouter()
    const searchParams = useSearchParams()

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        router.prefetch(APP_ROUTES.register)
    }, [])

    return (
        <SignInLayout
            title='Hello, Welcome'
            footer={<LoginHelp/>}
        >
            {messageContext}
            <Form
                form={form}
                colon={false}
                layout='vertical'
                scrollToFirstError
                onFinish={onLogin}
                requiredMark={false}
            >
                <Form.Item
                    name={FormNames.UserName}
                    label={<Typography.Text strong children='User Name' />}
                    getValueFromEvent={(event: React.ChangeEvent<HTMLInputElement>) => {
                        return event.target.value.trim()
                    }}
                    rules={[
                        {
                            required: true,
                            whitespace: true,
                            message: 'Please enter a valid username'
                        }
                    ]}
                >
                    <Input
                        size='large'
                        placeholder='Enter a user name'
                        maxLength={32}
                        autoFocus
                    />
                </Form.Item>

                <Flex vertical gap={14} className='actions'>
                    <Button
                        htmlType='submit'
                        type='primary'
                        size='large'
                        block
                        loading={loading}
                    >
                        Login
                    </Button>

                    <Flex align='baseline' justify='center'>
                        <Typography.Text>
                            Don't have an account?
                        </Typography.Text>
                        <Button
                            type='link'
                            disabled={loading}
                            style={{ padding: 4, paddingBottom: 0 }}
                            onClick={() => {
                                router.push(APP_ROUTES.register)
                            }}
                        >
                            Register
                        </Button>
                    </Flex>
                </Flex>
            </Form>
        </SignInLayout>
    )

    function onLogin() {
        validateFields()
            .then(async (values: FormValues) => {
                setLoading(true)
                const { userName } = values

                // get challenge from the server
                const { challenge, isValid, error } = await login(userName)

                if(!isValid) {
                    form.setFields([
                        {
                            name: 'userName',
                            errors: [error!]
                        }
                    ])
                    setLoading(false)
                    return
                }

                // get solved challenge from the browser
                const signedChallenge = await startAuthentication(challenge!)

                //verify solved challenge
                await verifyLogin(signedChallenge)
                
                router.push(searchParams.get('returnUrl') ?? APP_ROUTES.home)
            })
            .catch((error) => {
                const serverError = getServerError(error.message)
                if(serverError.property) {
                    form.setFields([
                        {
                            name: serverError.property,
                            errors: [serverError.message]
                        }
                    ])
                }
                else {
                    message.error("login Failed, please try again.")
                }
                console.log(error)
                setLoading(false)
            })
    }
}