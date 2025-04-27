import { useTranslation } from "@/context/translation-context";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  const translations = useTranslation();
  const { lang } = useParams();
  const direction = lang === "ar" ? "rtl" : "ltr";
  return (
    <footer className="relative z-10 bg-black text-white " dir={direction}>
      <div
        className={`py-8 px-4 sm:px-6 lg:px-8 ${direction === "rtl" ? "flex-row-reverse" : "flex-row"}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-start gap-8">
            {/* Newsletter Section */}
            <div className="w-full px-4 lg:w-5/12 space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                {translations.footer.platformDesc}
              </h2>
              <p className="text-lg text-gray-300 opacity-90 leading-relaxed">
                {translations.footer.innovativeSolutions}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <input
                  type="email"
                  placeholder={translations.footer.emailPlaceholder}
                  className="flex-1 px-3 py-4 text-sm text-start rounded-lg border-2 border-gray-600 bg-[#222222] focus:outline-none focus:border-[#53B4AB] focus:ring-2 focus:ring-[#53B4AB]/50 transition-all duration-200 text-white placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="px-4 py-3 text-sm bg-[#53B4AB] hover:bg-[#459c94] text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#53B4AB]/50"
                >
                  {translations.footer.send}
                </button>
              </div>
            </div>

            {/* Links Sections */}
            <div className="w-full px-4 sm:w-auto lg:w-3/12">
              <div className="space-y-6">
                <h4 className="text-xl font-bold text-white mb-4">
                  {translations.footer.company.title}
                </h4>
                <ul className="space-y-3">
                  {Object.entries(translations.footer.company).map(
                    ([key, value]) =>
                      key !== "title" && (
                        <li key={key}>
                          <Link
                            href="/"
                            className="text-gray-300 hover:text-[#53B4AB] transition-colors duration-200 text-lg py-2 block hover:translate-x-2"
                          >
                            {value}
                          </Link>
                        </li>
                      )
                  )}
                </ul>
              </div>
            </div>

            <div className="w-full px-4 sm:w-auto lg:w-3/12">
              <div className="space-y-6">
                <h4 className="text-xl font-bold text-white mb-4">
                  {translations.footer.quickLinks.title}
                </h4>
                <ul className="space-y-3">
                  {Object.entries(translations.footer.quickLinks).map(
                    ([key, value]) =>
                      key !== "title" && (
                        <li key={key}>
                          <Link
                            href="/"
                            className="text-gray-300 hover:text-[#53B4AB] transition-colors duration-200 text-lg py-2 block hover:translate-x-2"
                          >
                            {value}
                          </Link>
                        </li>
                      )
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Social & Copyright Section */}
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-white text-center md:text-start">
                  {translations.footer.followUs.title}
                </h4>
                <div className="flex justify-center md:justify-start gap-4">
                  {[Facebook, Twitter, Instagram, Linkedin].map(
                    (Icon, index) => (
                      <Link
                        key={index}
                        href="/"
                        className="p-3 rounded-full bg-[#222222] hover:bg-[#53B4AB] text-white transition-all duration-300 hover:rotate-12 hover:scale-110"
                        aria-label={`Social media link ${index + 1}`}
                      >
                        <Icon className="w-4 h-4" />
                      </Link>
                    )
                  )}
                </div>
              </div>
              <p className="text-gray-400 text-center md:text-right text-lg">
                © 2025
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <span className="absolute left-0 bottom-0 z-[-1]">
          <svg
            width="307"
            height="363"
            viewBox="0 0 407 463"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M264.298 132.87C264.298 132.87 334.574 168.571 351.234 229.028C367.894 289.482 326.991 353.261 326.991 353.261C326.991 353.261 259.076 319.021 242.413 258.566C225.753 198.111 264.298 132.87 264.298 132.87Z"
              fill="url(#paint0_linear_67_1125)"
            />
            <path
              d="M0.367622 223.851C0.367622 223.851 7.52324 145.352 57.5213 107.5C107.517 69.6476 181.906 84.0413 181.906 84.0413C181.906 84.0413 175.233 159.806 125.237 197.661C75.2413 235.512 0.367622 223.851 0.367622 223.851Z"
              fill="url(#paint1_linear_67_1125)"
            />
            <path
              d="M292.47 47.2272C292.47 72.9395 271.626 93.7837 245.913 93.7837C220.201 93.7837 199.357 72.9395 199.357 47.2272C199.357 21.5148 220.201 0.670586 245.913 0.670586C271.626 0.670586 292.47 21.5148 292.47 47.2272Z"
              fill="url(#paint2_linear_67_1125)"
            />
            <path
              d="M199.357 268.773C199.357 287.392 184.263 302.486 165.644 302.486C147.024 302.486 131.93 287.392 131.93 268.773C131.93 250.154 147.024 235.06 165.644 235.06C184.263 235.06 199.357 250.154 199.357 268.773Z"
              fill="url(#paint3_linear_67_1125)"
            />
            <path
              d="M22.7613 463.027H119.085L119.085 366.703C65.7749 367.249 22.7613 410.149 22.7613 463.027Z"
              fill="url(#paint4_linear_67_1125)"
            />
            <path
              d="M215.409 463.027H119.085L119.085 366.703C172.395 367.249 215.409 410.149 215.409 463.027Z"
              fill="url(#paint5_linear_67_1125)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_67_1125"
                x1="366.798"
                y1="283.659"
                x2="224.562"
                y2="202.521"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#181818" />
                <stop offset="1" stopColor="#222222" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_67_1125"
                x1="102.513"
                y1="72.8216"
                x2="79.7784"
                y2="234.986"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#181818" />
                <stop offset="1" stopColor="#222222" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_67_1125"
                x1="245.913"
                y1="93.7837"
                x2="245.913"
                y2="0.670586"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#181818" />
                <stop offset="1" stopColor="#222222" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_67_1125"
                x1="165.644"
                y1="302.486"
                x2="165.644"
                y2="235.06"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#181818" />
                <stop offset="1" stopColor="#222222" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_67_1125"
                x1="22.7613"
                y1="414.865"
                x2="119.085"
                y2="414.865"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#181818" />
                <stop offset="1" stopColor="#222222" />
              </linearGradient>
              <linearGradient
                id="paint5_linear_67_1125"
                x1="215.409"
                y1="414.865"
                x2="119.085"
                y2="414.865"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#181818" />
                <stop offset="1" stopColor="#222222" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <span className="absolute top-10 right-10 z-[-1]">
          <svg
            width="75"
            height="75"
            viewBox="0 0 75 75"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M37.5 -1.63918e-06C58.2107 -2.54447e-06 75 16.7893 75 37.5C75 58.2107 58.2107 75 37.5 75C16.7893 75 -7.33885e-07 58.2107 -1.63918e-06 37.5C-2.54447e-06 16.7893 16.7893 -7.33885e-07 37.5 -1.63918e-06Z"
              fill="url(#paint0_linear_1179_4)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_1179_4"
                x1="-1.63917e-06"
                y1="37.5"
                x2="75"
                y2="37.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#13C296" stopOpacity="0.31" />
                <stop offset="1" stopColor="#C4C4C4" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </span>
      </div>
    </footer>
  );
}
