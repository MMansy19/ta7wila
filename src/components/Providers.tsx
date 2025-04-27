'use client'

import { ProfileProvider } from '@/context/ProfileContext'
import { TranslationProvider } from '@/context/translation-context'

export function Providers({ children, translations }: { 
  children: React.ReactNode
  translations: any 
}) {
  return (
    <ProfileProvider>
      <TranslationProvider value={translations}>
        {children}
      </TranslationProvider>
    </ProfileProvider>
  )
}