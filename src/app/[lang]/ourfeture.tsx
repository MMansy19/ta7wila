
import Image from "next/image";
import { useTranslation } from '@/hooks/useTranslation';
import { motion } from "framer-motion";

export default function OurFeatures() {
  const translations = useTranslation();
  
  return (
    <div className="bg-black text-white lg:px-12 px-4">
      <div className=" mx-auto px-4 py-10 bg-gradient-to-t from-black to-[#161616] rounded-[80px]">
        <motion.div  initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col items-center max-w-full py-6">
          <h2 className="lg:text-2xl text-xl font-bold text-white">
            {translations.features.title}
          </h2>
        </motion.div>
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mt-4">
          <div className="flex-1 grid grid-cols-2 gap-1 ">
      
            <div className="p-4 rounded-2xl shadow-md">
              <h3 className="text-lg font-semibold mb-2">
                {translations.features.comprehensiveReport.title}
              </h3>
              <p className="text-sm text-gray-400">
                {translations.features.comprehensiveReport.description}
              </p>
              <div className="flex justify-center mt-4">
                <Image 
                  width={200} 
                  height={250} 
                  alt={translations.features.comprehensiveReport.altText}
                  src="/Frame 1984078147 (1).svg" 
                  loading="lazy"
                />
              </div>
            </div>

            {/* Data Protection */}
            <div className="p-4 rounded-2xl shadow-md">
              <h3 className="text-lg font-semibold mb-2">
                {translations.features.dataProtection.title}
              </h3>
              <p className="text-sm text-gray-400">
                {translations.features.dataProtection.description}
              </p>
              <div className="flex justify-center mt-4">
                <Image 
                  width={200} 
                  height={250} 
                  alt={translations.features.dataProtection.altText}
                  src="/Frame 1984078147.svg" 
                  loading="lazy"
                />
              </div>
            </div>

            {/* User Interface */}
            <div className="p-4 rounded-2xl shadow-md">
              <h3 className="text-lg font-semibold mb-2">
                {translations.features.userInterface.title}
              </h3>
              <p className="text-sm text-gray-400">
                {translations.features.userInterface.description}
              </p>
              <div className="flex justify-center mt-4">
                <Image 
                  width={200} 
                  height={250} 
                  alt={translations.features.userInterface.altText}
                  src="/Frame 1984078147 (2).svg" 
                  loading="lazy"
                />
              </div>
            </div>

            {/* Payment Support */}
            <div className="p-4 rounded-2xl shadow-md">
              <h3 className="text-lg font-semibold mb-2">
                {translations.features.paymentSupport.title}
              </h3>
              <p className="text-sm text-gray-400">
                {translations.features.paymentSupport.description}
              </p>
              <div className="flex justify-center mt-4">
                <Image 
                  width={200} 
                  height={250} 
                  alt={translations.features.paymentSupport.altText}
                  src="/Frame 1984078149.svg" 
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className="flex-1">
            <Image
              width={400}
              height={300}
              src="/Frame 1984078196.svg"
              alt={translations.features.mainImageAlt}
              className="rounded-2xl shadow-lg w-full h-auto"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}