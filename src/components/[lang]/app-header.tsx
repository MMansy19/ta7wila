"use client";
import { Avatar, AvatarFallback } from "@/components/[lang]/ui/avatar";
import { Button } from "@/components/[lang]/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/[lang]/ui/dropdown-menu";
import { Separator } from "@/components/[lang]/ui/separator";
import { SidebarTrigger } from "@/components/[lang]/ui/sidebar";

import { useTranslation } from '@/hooks/useTranslation';
import { useWhatsappStatus } from '@/hooks/useWhatsappStatus';
import { deleteCookie } from "cookies-next";
import { Bell, Wifi, WifiOff, MessageCircle, MessageCircleOff } from "lucide-react";
import Link from "next/link";
import { Locale } from "@/i18n-config";
import LocaleSwitcher from "../../app/lang-switcher/LangSwitcher";
import { useProfile } from "@/context/ProfileContext";
import axios from "axios";
import getAuthHeaders from "@/app/[lang]/dashboard/Shared/getAuth";
import { toast } from "react-hot-toast";
export default function Header({ lang }: { lang: Locale }) {
  const translations = useTranslation();
  const {profile, setProfile } = useProfile();
  const { whatsappStatus } = useWhatsappStatus();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

 
  // Updated handleCheckDeveloperMode
const handleCheckDeveloperMode = async () => {
  const data = await axios.post(
    `${apiUrl}/profile/isDeveloper`,
    {},
    { headers: getAuthHeaders() }
  );
  if (data.data.success) {
    setProfile(prev => {
      if (!prev) return prev; 
      return {
        ...prev,
        is_developer: true
      };
    });
    window.location.href = "/dashboard";
  }
};


  const handleToggleWiFi = async () => {
    
    try {
      const response = await axios.post(
        `${apiUrl}/transactions/is-enabled`,
        {},
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        setProfile(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            is_transactions_enabled: !prev.is_transactions_enabled
          };
        });
        toast.success(
          !profile?.is_transactions_enabled ? "WiFi enabled" : "WiFi disabled"
        );
      }
    } catch (error) {
      toast.error("Failed to toggle WiFi");
    }
  };





  function logout(event: any) {
    event.preventDefault();
    localStorage.removeItem("isDeveloper");
    deleteCookie("token");
    window.location.href = "/login";
  }

  

  return (
    <header className="flex h-16 shrink-0 text-white px-4 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4" />
      </div>

      <div className="flex items-center gap-4 w-auto">
        {profile?.user_type !== "admin" && (
          <div className="items-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={
                profile?.is_developer ? handleCheckDeveloperMode : handleCheckDeveloperMode
              }
              className="rounded-full px-4 py-5 bg-[#53B4AB] hover:bg-[#469c93] text-xs text-black"
            >
              <svg
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.8571 2.5L16.0352 5.59076C14.8506 4.89741 13.4717 4.5 12 4.5C7.58172 4.5 4 8.08172 4 12.5C4 13.9571 4.38958 15.3233 5.07026 16.5M9.14286 22.5L7.96473 19.4092C9.14936 20.1026 10.5283 20.5 12 20.5C16.4183 20.5 20 16.9183 20 12.5C20 11.0429 19.6104 9.67669 18.9297 8.5"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {
                profile?.is_developer 
                ? translations.header.devMode.backTo
                : translations.header.devMode.switchTo}
            </Button>
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 rounded-full bg-neutral-900 hover:bg-neutral-800 transition-colors"
            >
              <div
                className={`h-4 w-4 ${
                  profile?.is_transactions_enabled ? "text-green-400 animate-pulse" : "text-gray-400"
                }`}
              >
                {profile?.is_transactions_enabled ? <Wifi /> : <WifiOff />}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl">
            <DropdownMenuLabel className="text-white/90 font-semibold border-b border-white/10 pb-2">
              {translations.header.appStatus.title}
            </DropdownMenuLabel>
            
            {/* Status Display */}
            <div className="p-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  profile?.is_transactions_enabled 
                    ? "bg-green-400 animate-pulse shadow-lg shadow-green-400/50" 
                    : "bg-gray-400"
                }`} />
                <div className="flex flex-col">
                  <span className="text-white font-medium text-sm">
                    {profile?.is_transactions_enabled 
                      ? translations.header.appStatus.active 
                      : translations.header.appStatus.inactive}
                  </span>
                                     <span className="text-white/60 text-xs">
                     {profile?.is_transactions_enabled 
                       ? translations.header.appStatus.activeDesc 
                       : translations.header.appStatus.inactiveDesc}
                   </span>
                </div>
              </div>
            </div>

            {/* Control Button */}
            <div className="p-3">
              <button
                onClick={handleToggleWiFi}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                  profile?.is_transactions_enabled
                    ? "bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50"
                    : "bg-green-500/20 hover:bg-green-500/30 text-green-400 hover:text-green-300 border border-green-500/30 hover:border-green-500/50"
                } hover:shadow-lg`}
              >
                <div className="w-4 h-4">
                  {profile?.is_transactions_enabled ? <WifiOff /> : <Wifi />}
                </div>
                {profile?.is_transactions_enabled 
                  ? translations.header.appStatus.disable 
                  : translations.header.appStatus.enable}
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* WhatsApp Status */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 rounded-full bg-neutral-900 hover:bg-neutral-800 transition-colors"
            >
              <div
                className={`h-4 w-4 ${
                  whatsappStatus.isReady ? "text-green-400 animate-pulse" : "text-gray-400"
                }`}
              >
                {whatsappStatus.isReady ? <MessageCircle /> : <MessageCircleOff />}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl">
            <DropdownMenuLabel className="text-white/90 font-semibold border-b border-white/10 pb-2">
              {translations.header.whatsappStatus.title}
            </DropdownMenuLabel>
            
            {/* Status Display */}
            <div className="p-3">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  whatsappStatus.isReady 
                    ? "bg-green-400 animate-pulse shadow-lg shadow-green-400/50" 
                    : "bg-gray-400"
                }`} />
                <div className="flex flex-col">
                  <span className="text-white font-medium text-sm">
                    {whatsappStatus.isReady 
                      ? translations.header.whatsappStatus.connected 
                      : translations.header.whatsappStatus.disconnected}
                  </span>
                  <span className="text-white/60 text-xs">
                    {whatsappStatus.isReady 
                      ? translations.header.whatsappStatus.connectedDesc 
                      : translations.header.whatsappStatus.disconnectedDesc}
                  </span>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <LocaleSwitcher currentLang={lang} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 rounded-full bg-neutral-900"
            >
              <Bell className="h-4 w-4" />
              <span className="sr-only">
                {translations.header.notifications}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {translations.header.notifications}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {translations.header.noNotifications}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 gap-2 rounded-full px-0 md:h-10 md:px-2 hover:bg-transparent hover:text-white "
            >
              <Avatar className="h-8 w-8 md:h-10 md:w-10">
                <AvatarFallback>👨🏻</AvatarFallback>
              </Avatar>
              <div className="hidden flex-col text-left md:flex">
                <span className="text-sm font-semibold">
                  {profile?.name || "Loading..."}
                </span>
                <span className="text-xs text-gray-400">{profile?.email}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{profile?.name}</p>
                <p className="text-xs text-muted-foreground">{profile?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/dashboard/settings">
              <div className="p-1 hover:bg-slate-600/10 border-lg">
                {translations.header.profile}
              </div>
            </Link>
            <Link href="/dashboard/settings">
              <div className="p-1 hover:bg-slate-600/10 border-lg">
                {translations.header.settings}
              </div>
            </Link>
            <DropdownMenuSeparator />
            <button onClick={logout}>
              <div className="p-1 hover:bg-slate-600/10 border-lg">
                {" "}
                {translations.header.logout}
              </div>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
