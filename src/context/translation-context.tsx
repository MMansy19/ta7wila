'use client'

import { createContext, useContext } from 'react'
import { TranslationKeys } from '../../public/locales/types'

const TranslationContext = createContext<TranslationKeys | null>(null)

export function TranslationProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: TranslationKeys
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