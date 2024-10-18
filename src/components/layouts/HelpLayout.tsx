import React from 'react'
import { Flex, Modal, Typography } from 'antd'

type Props = {
    open: boolean,
    title?: string,
    content: React.ReactNode,
    imgSrc: string,
    onCancel: () => void
}

export default function HelpLayout(props: Props) {

    const { content, imgSrc, open, title = 'Need Help?', onCancel } = props

    return (
        <Modal
            className='help-modal'
            open={open}
            footer={false}
            onCancel={onCancel}
            width={800}
        >
            <Flex align='center' vertical>
                <img src={imgSrc} alt='help' />
                <Typography.Title level={3}>
                    {title}
                </Typography.Title>
            </Flex>
            <Typography.Paragraph className='help-content'>
                {content}
            </Typography.Paragraph>
        </Modal>
    )
}