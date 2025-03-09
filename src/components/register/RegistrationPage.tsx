'use client'

import React, { useEffect, useState } from 'react'
import { Button, Flex, Form, Input, Typography, message as antMessage } from 'antd'
import { startRegistration  } from '@simplewebauthn/browser'
import { register, verifyRegistration } from '@/actions/authActions'
import SignInLayout from '../layouts/SignInLayout'
import { useRouter } from '@/contexts'
import { APP_ROUTES } from '@/utils/constants'
import RegistrationHelp from './RegistrationHelp'


type Props = {}

enum FormNames {
    UserName = 'userName'
}

interface FormValues {
    [FormNames.UserName]: string
}

export default function RegistrationPage({ }: Props) {

    const [form] = Form.useForm()
    const { validateFields } = form
    const [message, messageContext] = antMessage.useMessage()
    const router = useRouter()

    const [registering, setRegistering] = useState(false)

    useEffect(() => {
        router.prefetch(APP_ROUTES.login)
    }, [])

    return (
        <SignInLayout
            title='Create New Passkey'
            footer={<RegistrationHelp/>}
        >
            {messageContext}
            <Form
                form={form}
                colon={false}
                layout='vertical'
                scrollToFirstError
                onFinish={onRegister}
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
                        placeholder='Enter a new or existing username'
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
                        loading={registering}
                    >
                        Register
                    </Button>

                    <Flex align='baseline' justify='center'>
                        <Typography.Text>
                            Already have an account?
                        </Typography.Text>
                        <Button
                            type='link'
                            disabled={registering}
                            style={{ padding: 4, paddingBottom: 0 }}
                            onClick={() => {
                                router.push(APP_ROUTES.login)
                            }}
                        >
                            Login
                        </Button>
                    </Flex>
                </Flex>
            </Form>
        </SignInLayout>
    )

    function onRegister() {
        validateFields()
            .then(async (values: FormValues) => {
                setRegistering(true)

                const { userName } = values

                // register user and get challenge from server
                const challenge = await register(userName)

                // get the solved challenge from the browser
                const signedChallenge = await startRegistration(challenge)

                // verify the signed challenge
                await verifyRegistration(signedChallenge)

                message.success('Registration Success')

                setTimeout(() => {
                    router.push(APP_ROUTES.login)
                }, 2000);
            })
            .catch((error) => {
                console.log(error)
                setRegistering(false)
                message.error("Registration Failed, please try again.")
            })
    }
}