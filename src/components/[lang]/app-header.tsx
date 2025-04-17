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
import { useDeveloper } from "@/context/DeveloperContext";
import { useTranslation } from "@/context/translation-context";
import { deleteCookie } from "cookies-next";
import { Bell, Globe, Wifi } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { checkDeveloperMode, getUserProfile, User } from "../../api/profile";
import { usePathname, useRouter } from "next/navigation";
import { Locale } from "@/i18n-config";
import DasboardLangSwitcher from "@/app/lang-switcher/dasboardLangSwitcher";

export default function Header({  lang }: {  lang: Locale; }) {
  const translations = useTranslation();
  const { isDeveloper, setIsDeveloper } = useDeveloper();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckDeveloperMode = useCallback(async () => {
    const isDev = await checkDeveloperMode();
    if (isDev) {
      setIsDeveloper(true);
      localStorage.setItem("isDeveloper", "true");
    }
  }, [setIsDeveloper]);

  useEffect(() => {
    const isDev = localStorage.getItem("isDeveloper") === "true";
    setIsDeveloper(isDev);

    getUserProfile().then((profile) => {
      setUser(profile);
    });
  }, [setIsDeveloper]);

  const goBacktoUserMode = async () => {
    const isDev = await checkDeveloperMode();
    if (isDev) {
      setIsDeveloper(false);
      localStorage.setItem("isDeveloper", "false");
      window.location.href = "/dashboard";
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
        {user?.user_type !== "admin" && (
          <div className="items-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={
                isDeveloper ? goBacktoUserMode : handleCheckDeveloperMode
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
              {isDeveloper
                ? translations.header.devMode.backTo
                : translations.header.devMode.switchTo}
            </Button>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 rounded-full bg-neutral-900"
        >
          <Wifi className="h-4 w-4" />
        </Button>

       {/* <DasboardLangSwitcher currentLang={lang} /> */}
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
                  {user?.name || "Loading..."}
                </span>
                <span className="text-xs text-gray-400">{user?.email}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/dashboard/settings">
              <DropdownMenuItem>{translations.header.profile}</DropdownMenuItem>
            </Link>
            <Link href="/dashboard/settings">
              <DropdownMenuItem>
                {translations.header.settings}
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <button onClick={logout} className="w-full text-start">
              <DropdownMenuItem> {translations.header.logout}</DropdownMenuItem>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
