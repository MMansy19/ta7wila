'use client'

import NavigationLink from "@/components/[lang]/NavigationLink";
import ActionButton from "@/components/[lang]/ui/landingbtn";
import { useTranslation } from "@/context/translation-context";
import { Locale } from "@/i18n-config";
import { getCookie } from "cookies-next";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import LocaleSwitcher from "../lang-switcher/LangSwitcher";

export default function Navbar({ lang, bgColor}: { lang: Locale;bgColor: string; }) {
      const [menuOpen, setMenuOpen] = useState(false);
      const [activeSection, setActiveSection] = useState("#home");
      const [mounted, setMounted] = useState(false);
      const [isLoggedIn, setIsLoggedIn] = useState(false);
      const navigationItems = [
        { translationKey: "home", href: "#home" },
        { translationKey: "about", href: "#about" },
        { translationKey: "services", href: "#services" },
        { translationKey: "features", href: "#features" },
        { translationKey: "app", href: "#app" },
      ];
    
      const translations = useTranslation()
    
      useEffect(() => {
        setMounted(true);
        const token = getCookie("token");
        setIsLoggedIn(!!token);

        const sections = navigationItems.map(({ href }) =>
          document.querySelector(href)
        );
    
        const observer = new IntersectionObserver(
          (entries: IntersectionObserverEntry[]) => {
            const visibleSection = entries.find((entry) => entry.isIntersecting);
            if (visibleSection) {
              setActiveSection(`#${visibleSection.target.id}`);
            }
          }
        );
    
        sections.forEach((section) => {
          if (section) observer.observe(section);
        });
    
        return () => observer.disconnect();
      }, [navigationItems]);

    return(
        <>
        <nav
          className={`flex fixed justify-between items-center px-4 lg:px-20 py-4 w-full ${bgColor} bg-opacity-90 z-50 transition-colors duration-300 review all componants in this land check responsive of all in all screen sure that all matching together px-4 sm:px-6 lg:px-8 py-2 sm:py-4 `}
        >
          <div className="flex items-center gap-2">
            <button
              className="block md:hidden text-xl px-4 py-2 rounded-lg font-bold text-[#53B4AB] bg-neutral-900"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <path
                    d="M3 6h18M3 12h18M3 18h18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
            </button>
            
            <Link href={isLoggedIn ? `/${lang}/dashboard` : "/login"}>
              <ActionButton text={isLoggedIn ? translations.navigation.dashboard : translations.navigation.tryFree} />
            </Link>
            <div className="text-[#53B4AB]">
            <LocaleSwitcher currentLang={lang}  />
            </div>
          </div>

          <div className="hidden md:flex gap-4 items-center">
            {navigationItems.map(({ translationKey, href }) => (
              <NavigationLink
                key={href}
                translationKey={translationKey}
                href={href}
                isActive={mounted && activeSection === href}
                translations={translations}
              />
            ))}
          </div>

          <Image
            width={144}
            height={50}
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/82abf788e81d00493505b733772e69127dd1ec73b52053d9ddbb4f60508f2764"
            className="object-contain w-36"
            alt="Company Logo"
          />
        </nav>
        {menuOpen && (
          <ul className="flex flex-col-reverse md:hidden text-right z-10 bg-black bg-opacity-80 text-white fixed w-full px-4 pt-16">
            {navigationItems.map((item, index) => (
              <li key={index}>
                <NavigationLink {...item} translations={translations} />
              </li>
            ))}
          </ul>
        )}
        </>
    )
}