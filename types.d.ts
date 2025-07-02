declare module '@/lib/i18n' {
    export function getTranslations(
      lang: 'ar' | 'en',
      namespace?: string
    ): Record<string, string>
  }
  
  declare module '@/components/lang-switcher/LangSwitcher' {
    import { FC } from 'react'
    const LangSwitcher: FC<{ currentLang: 'ar' | 'en' }>
    export default LangSwitcher
  }