'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Globe } from "lucide-react"

export default function LocaleSwitcher({ 
  currentLang,
  className 
}: { 
  currentLang: any;
  className?: string;  // Add className prop
}) {
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
    // Apply className to the root div
    <div className={`relative ${className || ''}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-9 h-9 bg-neutral-900 rounded-full hover:bg-neutral-800 transition-colors"
      >
        <Globe className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-neutral-900 rounded-lg overflow-hidden shadow-lg z-50">
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