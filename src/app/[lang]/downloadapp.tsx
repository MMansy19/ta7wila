import { useTranslation } from "@/context/translation-context";
import Image from "next/image";

export default function DownloadApp(){
    const translations = useTranslation();
    
    return(
        <div className="bg-black px-8 py-12 sm:px-16 md:px-32 md:py-28">
          <div className="flex flex-col md:flex-row justify-between bg-[#53B4AB] rounded-3xl gap-4">
            <Image
              width={654}
              height={386}
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/8d0239ca7eb2d30a2cac43584d4f3f153e32fba5858a5974ca53cbe0a235eb06?apiKey=e5206c7ab90c497bbb63352a863ec8f5&"
              alt="App preview showcase"
              className="object-contain rounded-3xl aspect-[1.35] h-auto max-w-full md:w-[654px]"
            />
            <div className="text-right flex flex-col items-end justify-items-start py-8 md:py-24 px-6 md:px-14">
              <h2 className="text-2xl md:text-4xl font-bold tracking-tighter leading-8 md:leading-10 text-black">
                {translations.downloadApp.title}
              </h2>
              <p className="mt-5 text-sm md:text-xl my-6 leading-6 md:leading-8 text-neutral-700">
                {translations.downloadApp.description}
              </p>
              <button className="flex gap-2 justify-center items-center px-6 py-3 md:px-8 md:py-5 text-sm md:text-base font-semibold text-center text-black bg-red-400 rounded-3xl min-h-[40px] md:min-h-[50px]">
                <svg
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.875 10.1128H3.125"
                    stroke="black"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.75 4.48779L3.125 10.1128L8.75 15.7378"
                    stroke="black"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="self-stretch my-auto">{translations.downloadApp.startNow}</span>
              </button>
            </div>
          </div>
        </div>
    )
}