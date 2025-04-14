import React from "react";
import { SidebarInset, SidebarProvider } from "@/components/[lang]/ui/sidebar";
import Header from "@/components/[lang]/app-header";
import { AppSidebar } from "@/components/[lang]/app-sidebar";
import AppProvider from "@/components/[lang]/client";
import { DeveloperProvider } from "@/context/DeveloperContext";
import { Locale } from "@/i18n-config";

export default async function Layout({ children ,params }: { children: React.ReactNode ;params: Promise<{ lang: Locale }>; }) {
  
  const { lang } = await params
  return (
    <DeveloperProvider>
      <AppProvider>
        <SidebarProvider>
          <AppSidebar dir={lang === 'ar' ? 'rtl' : 'ltr'} />
          <SidebarInset
            style={{
              backgroundImage: "url('/Dashboard.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <Header lang={lang}/>
            <div className="flex flex-1 flex-col gap-4 px-4 pt-0">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </AppProvider>
    </DeveloperProvider>
  );
}
