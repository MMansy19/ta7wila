'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LocaleSwitcher({ currentLang }: { currentLang: any }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const switchLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${currentLang}`, `/${newLocale}`);
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-12 h-12 bg-neutral-900 rounded-full hover:bg-neutral-800 transition-colors"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 11C21 16.5228 16.5228 21 11 21M21 11C21 5.47715 16.5228 1 11 1M21 11C21 9.34315 16.5228 8 11 8C5.47715 8 1 9.34315 1 11M21 11C21 12.6569 16.5228 14 11 14C5.47715 14 1 12.6569 1 11M11 21C5.47715 21 1 16.5228 1 11M11 21C13.2091 21 15 16.5228 15 11C15 5.47715 13.2091 1 11 1M11 21C8.79086 21 7 16.5228 7 11C7 5.47715 8.79086 1 11 1M1 11C1 5.47715 5.47715 1 11 1" stroke="#53B4AB" strokeWidth="1.5" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-neutral-900 rounded-lg overflow-hidden shadow-lg">
          <button 
            onClick={() => switchLocale('en')}
            disabled={currentLang === 'en'}
            className={`w-full px-4 py-2 text-left hover:bg-neutral-800 transition-colors ${currentLang === 'en' ? 'text-[#53B4AB]' : 'text-white'}`}
          >
            English
          </button>
          <button
            onClick={() => switchLocale('ar')}
            disabled={currentLang === 'ar'}
            className={`w-full px-4 py-2 text-left hover:bg-neutral-800 transition-colors ${currentLang === 'ar' ? 'text-[#53B4AB]' : 'text-white'}`}
          >
            العربية
          </button>
        </div>
      )}
    </div>
  );
}