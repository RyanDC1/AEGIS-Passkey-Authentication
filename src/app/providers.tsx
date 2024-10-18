'use client'

import React from 'react'
import { NextProgress } from '@/components/nextProgress'
import { RouterContext } from '@/contexts'

type Props = {
  children: React.ReactNode
}

export default function Providers({ children }: Props) {
  return (
    <RouterContext>
      {children}
      <NextProgress />
    </RouterContext>
  )
}