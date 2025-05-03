import { ReactNode } from "react";
import { i18nConfig, type Locale } from "../../i18n-config";
import "@/styles/globals.css";
import { TranslationProvider } from "@/context/translation-context";
import { getTranslations } from "@/lib/i18n";
import { TranslationKeys } from "../../../public/locales/types";

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ lang: locale }));
}

export const metadata = {
  title: "Ta7wila",
  description: "Payment Gateway",
  icons: {
    icon: "/Group (1).png",
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  const translations = (await getTranslations(
    lang
  )) as unknown as TranslationKeys;

  return (
    <html
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning={true}
    >
      <head>
        <link rel="shortcut icon" href="/Group (1).png" />
      </head>
      <body suppressHydrationWarning={true}>

          <TranslationProvider value={translations}>
            {children}
          </TranslationProvider>

      </body>
    </html>
  );
}
