'use client'

import React, { Suspense } from 'react'
import { LoginPage } from '@/components/login'
import '@/css/signIn.scss'


export default function register() {

  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  )
}