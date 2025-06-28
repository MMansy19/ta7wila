import Image from "next/image";
import ActionButton from "@/components/[lang]/ui/landingbtn";
import { useTranslation } from '@/hooks/useTranslation';
import Link from "next/link";

export default function Hero(){
const translations = useTranslation()
    return(
        <main
        id="home"
        className="flex flex-col items-center justify-center w-full px-4 font-bold text-center mt-6 "
      >
        <div className="flex z-10 shrink-0 gap-2.5 h-[159px] rounded-full w-[115px]" />
        <div className="flex flex-col items-center w-full max-w-[1054px]">
          <div className="flex flex-col items-center w-full px-4">
            <h1 className="text-3xl  text-white leading-[60px] max-w-[848px] sm:text-4xl sm:leading-[45px] ">
              {translations.hero.title}
            </h1>
            <p
              className="mt-6 text-base leading-8 text-neutral-400 max-w-[616px] sm:mt-4 sm:text-sm sm:leading-6"
            
            >
              {translations.hero.subtitle}
            </p>
            <div className="flex gap-4 items-center mt-6">
              <Link href="login">
                <ActionButton text={translations.navigation.howItWorks} />
              </Link>
              <Link href="login">
                <ActionButton text={translations.navigation.tryFree} />
              </Link>
            </div>
          </div>
          <Image
            src="/Dashboard 1.svg"
            className="object-contain my-10 w-full aspect-[1.74] rounded-[48px] sm:mt-6  "
            alt="Platform interface showcase"
            width={500}
            height={700}
            priority
          />
        </div>
      </main>
    )
}