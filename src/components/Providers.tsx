'use client'

import { ProfileProvider } from '@/context/ProfileContext'

export function Providers({ children, translations }: { 
  children: React.ReactNode
  translations: any 
}) {
  return (
    <ProfileProvider>
        {children}
    </ProfileProvider>
  )
}