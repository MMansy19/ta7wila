"use client";
import { useTranslation } from "@/context/translation-context";
import Image from "next/image";

type Payment = {
  id: number;
  value: string;
  payment_option: string;
  status: string;
  created_at: string;
  ref_id: string;
  is_public:boolean
};

type PaymentsProps = {
  payments?: Payment[];
};

export default function Payments({ payments = [] }: PaymentsProps) {
  const paymentOptions = [
    { name: "VF- CASH", key: "vcash", img: "/vcash.svg" },
    { name: "Et- CASH", key: "ecash", img: "/ecash.svg" },
    { name: "WE- CASH", key: "wecash", img: "/wecash.svg" },
    { name: "OR- CASH", key: "ocash", img: "/ocash.svg" },
    { name: "INSTAPAY", key: "instapay", img: "/instapay.svg" },
  ];

  const translations = useTranslation();

  return (
    <div className="bg-neutral-900 shadow-sm p-4 rounded-lg h-full text-white">
      <h2 className="text-xl font-bold mb-4">{translations.storeDetails.payments.title}</h2>

      {payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <p className="text-lg">{translations.storeDetails.payments.noData}</p>
        </div>
      ) : (
        payments.map((payment) => {
          const paymentOptionsArray = payment.payment_option
            ? payment.payment_option.split(",").map(opt => opt.trim())
            : [];

          return (
            <div key={payment.id} className="mb-4 p-4 text-white bg-[#1F1F1F] rounded-lg shadow-lg">
            <div className="flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <div className="flex space-x-2">
                  {paymentOptionsArray.map((paymentKey, index) => {
                    const selectedOption = paymentOptions.find(option => option.key === paymentKey);
                    if (!selectedOption) return null;
          
                    return (
                      <Image
                        key={index}
                        width={40}
                        height={40}
                        loading="lazy"
                        src={selectedOption.img}
                        alt={selectedOption.name}
                        className="object-contain aspect-square w-10 h-10"
                      />
                    );
                  })}
                </div>
          
              
                <div>
                  <p className="text-sm font-medium">{payment.payment_option}</p>
                  <p className="text-sm font-semibold">{payment.value}</p>
                </div>
              </div>
          
              <span className={`px-3 py-2 text-xs rounded-full ${
                payment.is_public ? 'bg-[#53B4AB] bg-opacity-30 text-[#53B4AB]' : 'bg-[#F58C7B] bg-opacity-30 text-[#F58C7B]'
              }`}>
                {payment.is_public ? translations.storeDetails.payments.payment.status.published : translations.storeDetails.payments.payment.status.notPublished}
              </span>

            </div>
          </div>
          
          );
        })
      )}
    </div>
  );
}
