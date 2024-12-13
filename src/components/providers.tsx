'use client'

import { SessionProvider } from "next-auth/react"

interface ProvidersTypes {
    children: React.ReactNode
}

export function Providers({children}: ProvidersTypes) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}