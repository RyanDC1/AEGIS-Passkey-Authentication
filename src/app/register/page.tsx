import React from 'react'
import { RegistrationPage } from '@/components/register'
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
      <RegistrationPage />
    </>
  )
}