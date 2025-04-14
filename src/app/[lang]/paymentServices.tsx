
import { useTranslation } from "@/context/translation-context";
import Image from "next/image";

export default function PaymentServices(){

  const translations  = useTranslation()

    return(
        <div className="flex flex-col items-center px-4 py-6 bg-img2 bg-black">
        <div className="flex relative gap-2 justify-center items-start  pt-10 pb-20 max-w-full  max-md:px-5">
          <div className="flex z-0 flex-col justify-center items-center my-auto  max-md:max-w-full">
            <div className="flex flex-col items-center max-w-full ">
              <h2 className="text-2xl font-bold text-right text-white">
              {translations.whatispayment}
              </h2>
              <p className="mt-12 text-base leading-6 text-center text-neutral-400 w-[714px] max-md:mt-10 max-md:max-w-full">
              {translations.paymentDescription}
              </p>
            </div>
            <div className="flex pt-2.5 mt-16 max-w-full w-[333px] max-md:mt-10">
              <Image src="/Frame 27.svg" width="800" height="900" alt="" />
            </div>
          </div>
        </div>
      </div>
    )
}