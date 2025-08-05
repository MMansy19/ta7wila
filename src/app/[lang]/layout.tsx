import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { locales, type Locale } from '../../i18n-config';
import '@/styles/globals.css';
import { DeveloperProvider } from '@/context/DeveloperContext';

export function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }));
}

export const metadata = {
  title: 'Ta7wila',
  description: 'Your application description',
};

export default async function RootLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ lang: Locale }>;
}) {

  const { lang } = await params;
  const messages = await getMessages({ locale: lang });

  return (
    <html
      lang={lang}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      suppressHydrationWarning
    >
      <head>
        <link rel="shortcut icon" href="/Frame 1984078121.png" />
      </head>
      <body>
        <NextIntlClientProvider locale={lang} messages={messages}>
          <DeveloperProvider>
            {children}
          </DeveloperProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}