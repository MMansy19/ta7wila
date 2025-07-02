import Link from "next/link";
import { TranslationKeys } from "../../../public/locales/types";



const NavigationLink = ({
  translationKey,
  href,
  isActive,
  translations,
}: {
  translationKey: string;
  href: string;
  isActive?: boolean;
  translations: TranslationKeys;
}) => (
  <Link href={href}>
    <button
      className={`gap-2.5 px-4 py-3 my-auto transition-all duration-500 ease-in-out ${
        isActive ? "font-bold text-[#53B4AB] border-b-2 border-[#53B4AB]" : "text-white"
      }`}
    >
      {translations.navigation[translationKey as keyof typeof translations.navigation]}
    </button>
  </Link>
);


export default NavigationLink ;