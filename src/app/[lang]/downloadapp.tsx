import { useTranslation } from '@/hooks/useTranslation';
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function DownloadApp() {
  const translations = useTranslation();
  const { lang } = useParams();
  const direction = lang === "ar" ? "rtl" : "ltr";

  return (
    <div className="bg-black px-8 py-12 sm:px-16 md:px-32 md:py-28">
      <div
  className={`flex flex-col md:flex-row ${
    direction === "rtl" ? "md:flex-row-reverse" : "md:flex-row"
  } justify-between bg-[#53B4AB] rounded-3xl gap-4 items-center  `}
>
  {/* Image */}
  <motion.div
    initial={{ x: direction === "rtl" ? -100 : 100, opacity: 0 }}
    whileInView={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className={`w-full md:w-[654px] flex justify-center items-center ${
      direction === "rtl" ? "md:order-1" : "md:order-1"
    }`}
  >
    <Image
      width={654}
      height={386}
      loading="lazy"
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/8d0239ca7eb2d30a2cac43584d4f3f153e32fba5858a5974ca53cbe0a235eb06?apiKey=e5206c7ab90c497bbb63352a863ec8f5&"
      alt="App preview showcase"
      className="object-contain rounded-3xl aspect-[1.35] h-auto max-w-full"
    />
  </motion.div>

  {/* Text */}
  <motion.div
    initial={{ x: direction === "ltr" ? 100 : -100, opacity: 0 }}
    whileInView={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className={`flex flex-col px-6 md:px-10 ${
      direction === "rtl" ? "text-right md:order-1" : "text-left md:order-2"
    }`}
  >
    <h2 className="text-2xl md:text-3xl font-bold tracking-tighter leading-8 md:leading-10 text-black">
      {translations.downloadApp.title}
    </h2>
    <p className="mt-5 text-sm md:text-xl my-2 md:my-6 leading-6 md:leading-8 text-neutral-700">
      {translations.downloadApp.description}
    </p>
    <div className="flex justify-start items-start gap-4 py-4">
      <button
        className={`flex gap-2 justify-center text-sm items-center px-6 py-3 md:text-base font-semibold text-center text-black bg-red-400 rounded-lg min-h-[40px] md:min-h-[50px] ${
          direction === "ltr" ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <span className="self-stretch my-auto">
          {translations.downloadApp.startNow}
        </span>
     
      </button>
    </div>
  </motion.div>
</div>

    </div>
  );
}

