import { useTranslation } from "@/context/translation-context";

export default function useCurrency() {
    const translations = useTranslation();
    const locale = translations.dir === "rtl" ? "ar-EG" : "en-EG";

    return (value: number) =>
        new Intl.NumberFormat(locale, {
            style: "currency",
            notation: "compact",
            currency: "EGP",
        }).format(value);
}