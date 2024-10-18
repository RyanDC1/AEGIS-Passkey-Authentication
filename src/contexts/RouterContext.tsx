'use client'

import React, { useContext } from 'react'
import { useRouter as useAppRouter } from 'next13-progressbar'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

interface Props {
    children: React.ReactNode
}

const RouterContext = React.createContext<AppRouterInstance>(null!)

export const useRouter = () => {
    return useContext(RouterContext)
}

export default function RouterProvider({ children }: Props) {
    const router = useAppRouter()
    
    return (
        <RouterContext.Provider value={router}>
            {children}
        </RouterContext.Provider>
    )
}