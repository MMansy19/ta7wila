'use client'

import { createContext, useContext } from 'react'
import { TranslationKeys } from '../../public/locales/types'

interface TranslationContextType extends TranslationKeys {
  dir: 'rtl' | 'ltr';
}

const TranslationContext = createContext<TranslationContextType | null>(null)

export function TranslationProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: TranslationKeys & { dir: 'rtl' | 'ltr' }
}) {
  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}