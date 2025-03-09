import React, { Suspense } from 'react'
import { LoginPage } from '@/components/login'
import Image from 'next/image'
import '@/css/signIn.scss'


export default function register() {

  return (
    <>
      <Image
        src={'/images/MAIN_BG.jpg'}
        fill
        alt="home-background"
        quality={100}
      />
      <Suspense>
        <LoginPage />
      </Suspense>
    </>
  )
}