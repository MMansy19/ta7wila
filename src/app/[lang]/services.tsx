import { useTranslation } from "@/context/translation-context";
import { motion } from "framer-motion";

export default function Services() {
  const translations = useTranslation();
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-center py-8 px-4  lg:px-8 w-full bg-black">
      <div className="flex flex-col flex-1 my-auto w-full basis-0 max-md:max-w-full mx-6 bg-gradient-to-b from-black to-[#161616] p-6 rounded-[120px] ">
        <div className="flex flex-col items-center max-w-full  ">
          <h2 className="text-xl lg:text-2xl font-bold  text-white">
            {translations.services.title}
          </h2>
        </div>
        <motion.div
          className="flex flex-wrap gap-4 items-center lg:p-9 mt-20 w-full text-black max-md:mt-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`flex overflow-hidden flex-col flex-1 shrink self-stretch px-16 pt-16 my-auto bg-neutral-400 basis-0 min-w-[260px] h-[350px] rounded-[72px] max-md:px-5`}
          >
            <div className="flex flex-col">
              <svg
                width="80"
                height="81"
                viewBox="0 0 80 81"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className=" "
              >
                <path
                  d="M40 26.7238V40.0571L48.3333 48.3904"
                  stroke="white"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.6808 18.7379L17.6987 17.7558L17.6987 17.7558L18.6808 18.7379ZM14.4595 22.9592L13.0706 22.9661C13.0744 23.7277 13.6909 24.3442 14.4525 24.348L14.4595 22.9592ZM22.9377 24.3907C23.7047 24.3945 24.3297 23.7758 24.3335 23.0088C24.3374 22.2417 23.7187 21.6168 22.9516 21.6129L22.9377 24.3907ZM15.8057 14.467C15.8019 13.6999 15.1769 13.0813 14.4099 13.0851C13.6428 13.089 13.0241 13.7139 13.028 14.481L15.8057 14.467ZM11.3889 40.0571C11.3889 39.2901 10.7671 38.6682 10 38.6682C9.23294 38.6682 8.61111 39.2901 8.61111 40.0571H11.3889ZM55.6954 67.2459C56.3594 66.8618 56.5863 66.0122 56.2022 65.3482C55.8181 64.6842 54.9685 64.4573 54.3045 64.8414L55.6954 67.2459ZM64.7843 54.3617C64.4002 55.0256 64.6271 55.8753 65.2911 56.2594C65.955 56.6434 66.8047 56.4165 67.1888 55.7526L64.7843 54.3617ZM17.9162 17.7509C17.3711 18.2906 17.3667 19.17 17.9064 19.7151C18.4461 20.2602 19.3255 20.2645 19.8706 19.7249L17.9162 17.7509ZM62.0887 17.969C49.7812 5.66147 29.9071 5.54741 17.6987 17.7558L19.6629 19.72C30.7679 8.61495 48.8831 8.69179 60.1245 19.9332L62.0887 17.969ZM17.6987 17.7558L13.4774 21.9771L15.4416 23.9412L19.6629 19.72L17.6987 17.7558ZM14.4525 24.348L22.9377 24.3907L22.9516 21.6129L14.4665 21.5703L14.4525 24.348ZM15.8484 22.9522L15.8057 14.467L13.028 14.481L13.0706 22.9661L15.8484 22.9522ZM40 11.446C55.8015 11.446 68.6111 24.2556 68.6111 40.0571H71.3889C71.3889 22.7215 57.3356 8.66824 40 8.66824V11.446ZM40 68.6682C24.1985 68.6682 11.3889 55.8586 11.3889 40.0571H8.61111C8.61111 57.3927 22.6644 71.446 40 71.446V68.6682ZM54.3045 64.8414C50.0976 67.275 45.2136 68.6682 40 68.6682V71.446C45.715 71.446 51.0771 69.9174 55.6954 67.2459L54.3045 64.8414ZM68.6111 40.0571C68.6111 45.2708 67.2179 50.1548 64.7843 54.3617L67.1888 55.7526C69.8603 51.1343 71.3889 45.7721 71.3889 40.0571H68.6111ZM19.8706 19.7249C25.0414 14.6053 32.1504 11.446 40 11.446V8.66824C31.3892 8.66824 23.5859 12.1373 17.9162 17.7509L19.8706 19.7249Z"
                  fill="white"
                />
              </svg>

              <div className="flex flex-col mt-8 w-full">
                <div className="text-2xl font-semibold leading-none">
                  {translations.services.instantActivation.title}
                </div>
                <div className="mt-3 text-xs lg:text-sm font-medium leading-5">
                  {translations.services.instantActivation.description}
                </div>
              </div>
            </div>
            <svg
              width="72"
              height="82"
              viewBox="0 0 72 82"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="object-contain mt-8 aspect-[0.88] self-end"
            >
              <path
                d="M46.7869 23.4844C46.7869 23.4844 59.241 29.8111 62.1933 40.525C65.1458 51.2385 57.8971 62.5411 57.8971 62.5411C57.8971 62.5411 45.8615 56.4733 42.9086 45.7596C39.9561 35.0461 46.7869 23.4844 46.7869 23.4844Z"
                fill="white"
              />
              <path
                d="M0.0144921 39.6079C0.0144921 39.6079 1.28258 25.6966 10.143 18.9887C19.003 12.2807 32.1858 14.8315 32.1858 14.8315C32.1858 14.8315 31.0033 28.2582 22.1433 34.9666C13.2833 41.6746 0.0144921 39.6079 0.0144921 39.6079Z"
                fill="white"
              />
              <path
                d="M51.7794 8.3078C51.7794 12.8644 48.0854 16.5583 43.5288 16.5583C38.9722 16.5583 35.2783 12.8644 35.2783 8.3078C35.2783 3.75117 38.9722 0.0572453 43.5288 0.0572453C48.0854 0.0572453 51.7794 3.75117 51.7794 8.3078Z"
                fill="white"
              />
              <path
                d="M35.2053 48.4997C34.6912 51.759 31.6322 53.9845 28.3729 53.4704C25.1136 52.9563 22.8881 49.8973 23.4022 46.638C23.9162 43.3786 26.9752 41.1531 30.2346 41.6672C33.4939 42.1813 35.7194 45.2403 35.2053 48.4997Z"
                fill="white"
              />
              <path
                d="M3.98303 81.9937H21.0531L21.0531 64.9235C11.6057 65.0204 3.98303 72.6228 3.98303 81.9937Z"
                fill="white"
              />
              <path
                d="M38.1233 81.9937H21.0532L21.0532 64.9235C30.5006 65.0204 38.1233 72.6228 38.1233 81.9937Z"
                fill="white"
              />
            </svg>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`flex overflow-hidden flex-col flex-1 shrink self-stretch px-16 pt-16 my-auto bg-[#F58C7B] basis-0 min-w-[260px] h-[350px] rounded-[72px] max-md:px-5`}
          >
            <div className="flex flex-col">
              <svg
                width="61"
                height="61"
                viewBox="0 0 61 61"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className=""
              >
                <rect
                  x="5.66666"
                  y="5.05713"
                  width="25"
                  height="20"
                  rx="5"
                  stroke="white"
                  strokeWidth="2.08333"
                />
                <rect
                  x="30.6666"
                  y="35.0571"
                  width="25"
                  height="20"
                  rx="5"
                  stroke="white"
                  strokeWidth="2.08333"
                />
                <path
                  d="M51.7021 10.0571L54.9343 13.2894C55.9106 14.2657 55.9106 15.8486 54.9343 16.8249L51.7021 20.0571M40.6666 15.0571L54.2021 15.0571"
                  stroke="white"
                  strokeWidth="2.08333"
                  strokeLinecap="round"
                />
                <path
                  d="M9.63112 40.0571L6.39889 43.2894C5.42258 44.2657 5.42258 45.8486 6.39889 46.8249L9.63112 50.0571M20.6667 45.0571L7.13112 45.0571"
                  stroke="white"
                  strokeWidth="2.08333"
                  strokeLinecap="round"
                />
              </svg>

              <div className="flex flex-col mt-8 w-full">
                <div className="text-2xl font-semibold leading-none">
                  {translations.services.currencyConversion.title}
                </div>
                <div className="mt-3 text-xs lg:text-sm font-medium leading-5">
                  {translations.services.currencyConversion.description}
                </div>
              </div>
            </div>
            <svg
              width="72"
              height="82"
              viewBox="0 0 72 82"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="object-contain mt-8 aspect-[0.88] self-end"
            >
              <path
                d="M46.7869 23.4844C46.7869 23.4844 59.241 29.8111 62.1933 40.525C65.1458 51.2385 57.8971 62.5411 57.8971 62.5411C57.8971 62.5411 45.8615 56.4733 42.9086 45.7596C39.9561 35.0461 46.7869 23.4844 46.7869 23.4844Z"
                fill="white"
              />
              <path
                d="M0.0144921 39.6079C0.0144921 39.6079 1.28258 25.6966 10.143 18.9887C19.003 12.2807 32.1858 14.8315 32.1858 14.8315C32.1858 14.8315 31.0033 28.2582 22.1433 34.9666C13.2833 41.6746 0.0144921 39.6079 0.0144921 39.6079Z"
                fill="white"
              />
              <path
                d="M51.7794 8.3078C51.7794 12.8644 48.0854 16.5583 43.5288 16.5583C38.9722 16.5583 35.2783 12.8644 35.2783 8.3078C35.2783 3.75117 38.9722 0.0572453 43.5288 0.0572453C48.0854 0.0572453 51.7794 3.75117 51.7794 8.3078Z"
                fill="white"
              />
              <path
                d="M35.2053 48.4997C34.6912 51.759 31.6322 53.9845 28.3729 53.4704C25.1136 52.9563 22.8881 49.8973 23.4022 46.638C23.9162 43.3786 26.9752 41.1531 30.2346 41.6672C33.4939 42.1813 35.7194 45.2403 35.2053 48.4997Z"
                fill="white"
              />
              <path
                d="M3.98303 81.9937H21.0531L21.0531 64.9235C11.6057 65.0204 3.98303 72.6228 3.98303 81.9937Z"
                fill="white"
              />
              <path
                d="M38.1233 81.9937H21.0532L21.0532 64.9235C30.5006 65.0204 38.1233 72.6228 38.1233 81.9937Z"
                fill="white"
              />
            </svg>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`flex overflow-hidden flex-col flex-1 shrink self-stretch px-16 pt-16 my-auto bg-[#A5CBAD] basis-0 min-w-[260px]  h-[350px] rounded-[72px] max-md:px-5`}
          >
            <div className="flex flex-col">
              <svg
                width="73"
                height="73"
                viewBox="0 0 73 73"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className=""
              >
                <path
                  d="M61.8334 40.5571C61.8334 54.6404 50.4166 66.0571 36.3334 66.0571C22.2501 66.0571 10.8334 54.6404 10.8334 40.5571C10.8334 26.4739 22.2501 15.0571 36.3334 15.0571C50.4166 15.0571 61.8334 26.4739 61.8334 40.5571Z"
                  stroke="white"
                  strokeWidth="2.5"
                />
                <path
                  d="M45.3334 7.29932C42.4724 6.49013 39.4534 6.05713 36.3334 6.05713C33.2133 6.05713 30.1944 6.49013 27.3334 7.29932"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M40.8334 42.0571C40.8334 44.5424 38.8187 46.5571 36.3334 46.5571C33.8481 46.5571 31.8334 44.5424 31.8334 42.0571C31.8334 39.5718 33.8481 37.5571 36.3334 37.5571C38.8187 37.5571 40.8334 39.5718 40.8334 42.0571Z"
                  stroke="white"
                  strokeWidth="2.5"
                />
                <path
                  d="M36.3334 36.0571V27.0571"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex flex-col mt-8 w-full">
                <div className="text-2xl font-semibold leading-none">
                  {translations.services.support.title}
                </div>
                <div className="mt-3 text-xs lg:text-sm font-medium leading-5">
                  {translations.services.support.description}
                </div>
              </div>
            </div>
            <svg
              width="72"
              height="82"
              viewBox="0 0 72 82"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="object-contain mt-8 aspect-[0.88] self-end"
            >
              <path
                d="M46.7869 23.4844C46.7869 23.4844 59.241 29.8111 62.1933 40.525C65.1458 51.2385 57.8971 62.5411 57.8971 62.5411C57.8971 62.5411 45.8615 56.4733 42.9086 45.7596C39.9561 35.0461 46.7869 23.4844 46.7869 23.4844Z"
                fill="white"
              />
              <path
                d="M0.0144921 39.6079C0.0144921 39.6079 1.28258 25.6966 10.143 18.9887C19.003 12.2807 32.1858 14.8315 32.1858 14.8315C32.1858 14.8315 31.0033 28.2582 22.1433 34.9666C13.2833 41.6746 0.0144921 39.6079 0.0144921 39.6079Z"
                fill="white"
              />
              <path
                d="M51.7794 8.3078C51.7794 12.8644 48.0854 16.5583 43.5288 16.5583C38.9722 16.5583 35.2783 12.8644 35.2783 8.3078C35.2783 3.75117 38.9722 0.0572453 43.5288 0.0572453C48.0854 0.0572453 51.7794 3.75117 51.7794 8.3078Z"
                fill="white"
              />
              <path
                d="M35.2053 48.4997C34.6912 51.759 31.6322 53.9845 28.3729 53.4704C25.1136 52.9563 22.8881 49.8973 23.4022 46.638C23.9162 43.3786 26.9752 41.1531 30.2346 41.6672C33.4939 42.1813 35.7194 45.2403 35.2053 48.4997Z"
                fill="white"
              />
              <path
                d="M3.98303 81.9937H21.0531L21.0531 64.9235C11.6057 65.0204 3.98303 72.6228 3.98303 81.9937Z"
                fill="white"
              />
              <path
                d="M38.1233 81.9937H21.0532L21.0532 64.9235C30.5006 65.0204 38.1233 72.6228 38.1233 81.9937Z"
                fill="white"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
