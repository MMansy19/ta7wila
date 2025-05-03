import Image from "next/image";
import ActionButton from "@/components/[lang]/ui/landingbtn";
import Link from "next/link";
import { useTranslation } from "@/context/translation-context";
import { motion } from "framer-motion";

export default function DevPart() {
  const translations = useTranslation();

  return (
    <div className="lg:px-10 bg-black">
      <div className="bg-gradient-to-b from-black to-[#161616] rounded-[50px] md:rounded-[120px] min-h-28">
        <div className="p-6 xl:px-20 flex flex-col-reverse md:flex-row justify-between items-center gap-6">

          {/* Text Content */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex flex-col text-white max-w-2xl space-y-6 md:space-y-8"
          >
            <h2 className="text-2xl font-bold">{translations.devPart.title}</h2>
            <p className="text-[#ACACAC] leading-relaxed">
              {translations.devPart.description.map((text, index) => (
                <span key={index}>
                  {text}
                  <br />
                  <br />
                </span>
              ))}
            </p>
            <div className="flex items-start">
              <Link href="login">
                <ActionButton text={translations.navigation.tryFree} />
              </Link>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            viewport={{ once: true }}
            className="w-full md:w-auto flex justify-center md:justify-start"
          >
            <Image
              src="/Group 48095533.svg"
              width={600}
              height={200}
              className="w-full max-w-[600px] h-auto"
              alt={translations.devPart.platformLogoAlt}
              loading="lazy"
            />
          </motion.div>

        </div>
      </div>
    </div>
  );
}

