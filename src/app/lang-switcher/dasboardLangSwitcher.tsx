'use client'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/[lang]/ui/dropdown-menu';
import { Button } from "@/components/[lang]/ui/button";
import {  Globe } from "lucide-react";
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function DasboardLangSwitcher({ currentLang }: { currentLang: any }){

    const router = useRouter();
      const pathname = usePathname();
  

    const switchLocale = (newLocale: string) => {
        const newPath = pathname.replace(`/${currentLang}`, `/${newLocale}`);
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
        router.push(newPath);
      
      };
    return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 rounded-full bg-neutral-900"
          >
            <Globe className="h-4 w-4" />
           
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <button
              onClick={() => switchLocale("en")}
              disabled={currentLang === "en"}
            >
              English
            </button>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <button
              onClick={() => switchLocale("ar")}
              disabled={currentLang === "ar"}
            >
              العربيه
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
};

