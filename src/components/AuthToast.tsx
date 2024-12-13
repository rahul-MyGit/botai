'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

export function AuthToast() {
    const searchParams = useSearchParams()
    
    useEffect(() => {
        const authRequired = searchParams.get('auth')
        if (authRequired === 'required') {
            toast.error('Please login to access this feature', {
                position: 'bottom-center',
                duration: 3000,
            })
        }
    }, [searchParams])

    return null
}