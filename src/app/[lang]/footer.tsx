import { useTranslation } from "@/context/translation-context";
import Link from "next/link";

export default function Footer() {
    const translations = useTranslation();
    return (
        <footer className="container relative z-10 bg-black text-white pt-20 pb-10 lg:pt-[120px] lg:pb-20">
            <div className="mx-auto">
                <div className="flex flex-wrap items-start flex-row-reverse px-4">
                    <div className="w-full px-4 lg:w-4/12 text-right">
                        <div className="w-full mb-10">
                            <h2 className="text-2xl md:text-2xl font-semibold leading-8 text-white">
                                {translations.footer.platformDesc}
                            </h2>
                            <p className="text-base text-body-color py-8 dark:text-dark-6 mb-7">
                                {translations.footer.innovativeSolutions}
                            </p>
                            <div className="flex lg:flex-nowrap justify-center lg:justify-end gap-4 mt-10">
                                <button type="submit" className="flex justify-center items-center px-4 py-3 text-center text-black whitespace-nowrap bg-[#53B4AB] rounded-lg">
                                    <span className="z-10">{translations.footer.send}</span>
                                </button>
                                <input
                                    type="email"
                                    placeholder={translations.footer.emailPlaceholder}
                                    className="px-6 py-3 text-right rounded-lg border-2 border-solid border-zinc-300 bg-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="w-full px-4 sm:w-1/2 lg:w-2/12 text-right">
                        <div className="w-full mb-10">
                            <h4 className="text-lg font-semibold text-dark dark:text-white mb-9">
                                {translations.footer.company.title}
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/" className="inline-block text-base leading-loose text-body-color">
                                        {translations.footer.company.support}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/" className="inline-block text-base leading-loose text-body-color">
                                        {translations.footer.company.successStories}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/" className="inline-block text-base leading-loose text-body-color">
                                        {translations.footer.company.privacySettings}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="w-full px-4 sm:w-1/2 lg:w-2/12 text-right">
                        <div className="w-full mb-10">
                            <h4 className="text-lg font-semibold text-dark dark:text-white mb-9">
                                {translations.footer.quickLinks.title}
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/" className="inline-block text-base leading-loose text-body-color">
                                        {translations.footer.quickLinks.premiumSupport}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/" className="inline-block text-base leading-loose text-body-color">
                                        {translations.footer.quickLinks.services}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/" className="inline-block text-base leading-loose text-body-color">
                                        {translations.footer.quickLinks.downloadApp}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="w-full px-4 sm:w-1/2 lg:w-3/12 text-right">
                        <div className="w-full mb-10 items-start">
                            <h4 className="text-lg font-semibold dark:text-white mb-9">
                                {translations.footer.followUs.title}
                            </h4>
                            <div className="flex justify-end items-center mb-6 space-x-reverse space-x-3 sm:space-x-4">
                                <Link
                                    href="/"
                                    className="flex items-center justify-center w-8 h-8 mr-3 border rounded-full text-dark hover:border-primary hover:bg-primary border-stroke dark:border-dark-3 dark:hover:border-primary dark:text-white hover:text-white sm:mr-4 lg:mr-3 xl:mr-4"
                                >
                                    <svg
                                        width="8"
                                        height="16"
                                        viewBox="0 0 8 16"
                                        className="fill-current"
                                    >
                                        <path
                                            d="M7.43902 6.4H6.19918H5.75639V5.88387V4.28387V3.76774H6.19918H7.12906C7.3726 3.76774 7.57186 3.56129 7.57186 3.25161V0.516129C7.57186 0.232258 7.39474 0 7.12906 0H5.51285C3.76379 0 2.54609 1.44516 2.54609 3.5871V5.83226V6.34839H2.10329H0.597778C0.287819 6.34839 0 6.63226 0 7.04516V8.90323C0 9.26452 0.243539 9.6 0.597778 9.6H2.05902H2.50181V10.1161V15.3032C2.50181 15.6645 2.74535 16 3.09959 16H5.18075C5.31359 16 5.42429 15.9226 5.51285 15.8194C5.60141 15.7161 5.66783 15.5355 5.66783 15.3806V10.1419V9.62581H6.13276H7.12906C7.41688 9.62581 7.63828 9.41935 7.68256 9.10968V9.08387V9.05806L7.99252 7.27742C8.01466 7.09677 7.99252 6.89032 7.85968 6.68387C7.8154 6.55484 7.61614 6.42581 7.43902 6.4Z"
                                        />
                                    </svg>
                                </Link>
                                <Link
                                    href="/"
                                    className="flex items-center justify-center w-8 h-8 mr-3 border rounded-full text-dark hover:border-primary hover:bg-primary border-stroke dark:border-dark-3 dark:hover:border-primary dark:text-white hover:text-white sm:mr-4 lg:mr-3 xl:mr-4"
                                >
                                    <svg
                                        width="16"
                                        height="12"
                                        viewBox="0 0 16 12"
                                        className="fill-current"
                                    >
                                        <path
                                            d="M14.2194 2.06654L15.2 0.939335C15.4839 0.634051 15.5613 0.399217 15.5871 0.2818C14.8129 0.704501 14.0903 0.845401 13.6258 0.845401H13.4452L13.3419 0.751468C12.7226 0.258317 11.9484 0 11.1226 0C9.31613 0 7.89677 1.36204 7.89677 2.93542C7.89677 3.02935 7.89677 3.17025 7.92258 3.26419L8 3.73386L7.45806 3.71037C4.15484 3.61644 1.44516 1.03327 1.00645 0.587084C0.283871 1.76125 0.696774 2.88845 1.13548 3.59296L2.0129 4.90802L0.619355 4.20352C0.645161 5.18982 1.05806 5.96477 1.85806 6.52838L2.55484 6.99804L1.85806 7.25636C2.29677 8.45401 3.27742 8.94716 4 9.13503L4.95484 9.36986L4.05161 9.93346C2.60645 10.8728 0.8 10.8024 0 10.7319C1.62581 11.7652 3.56129 12 4.90323 12C5.90968 12 6.65806 11.9061 6.83871 11.8356C14.0645 10.2857 14.4 4.41487 14.4 3.2407V3.07632L14.5548 2.98239C15.4323 2.23092 15.7935 1.8317 16 1.59687C15.9226 1.62035 15.8194 1.66732 15.7161 1.6908L14.2194 2.06654Z"
                                        />
                                    </svg>
                                </Link>
                                <Link
                                    href="/"
                                    className="flex items-center justify-center w-8 h-8 mr-3 border rounded-full text-dark hover:border-primary hover:bg-primary border-stroke dark:border-dark-3 dark:hover:border-primary dark:text-white hover:text-white sm:mr-4 lg:mr-3 xl:mr-4"
                                >
                                    <svg
                                        width="16"
                                        height="12"
                                        viewBox="0 0 16 12"
                                        className="fill-current"
                                    >
                                        <path
                                            d="M15.6645 1.88018C15.4839 1.13364 14.9419 0.552995 14.2452 0.359447C13.0065 6.59222e-08 8 0 8 0C8 0 2.99355 6.59222e-08 1.75484 0.359447C1.05806 0.552995 0.516129 1.13364 0.335484 1.88018C0 3.23502 0 6 0 6C0 6 0 8.79263 0.335484 10.1198C0.516129 10.8664 1.05806 11.447 1.75484 11.6406C2.99355 12 8 12 8 12C8 12 13.0065 12 14.2452 11.6406C14.9419 11.447 15.4839 10.8664 15.6645 10.1198C16 8.79263 16 6 16 6C16 6 16 3.23502 15.6645 1.88018ZM6.4 8.57143V3.42857L10.5548 6L6.4 8.57143Z"
                                        />
                                    </svg>
                                </Link>
                                <Link
                                    href="/"
                                    className="flex items-center justify-center w-8 h-8 mr-3 border rounded-full text-dark hover:border-primary hover:bg-primary border-stroke dark:border-dark-3 dark:hover:border-primary dark:text-white hover:text-white sm:mr-4 lg:mr-3 xl:mr-4"
                                >
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 14 14"
                                        className="fill-current"
                                    >
                                        <path
                                            d="M13.0214 0H1.02084C0.453707 0 0 0.451613 0 1.01613V12.9839C0 13.5258 0.453707 14 1.02084 14H12.976C13.5432 14 13.9969 13.5484 13.9969 12.9839V0.993548C14.0422 0.451613 13.5885 0 13.0214 0ZM4.15142 11.9H2.08705V5.23871H4.15142V11.9ZM3.10789 4.3129C2.42733 4.3129 1.90557 3.77097 1.90557 3.11613C1.90557 2.46129 2.45002 1.91935 3.10789 1.91935C3.76577 1.91935 4.31022 2.46129 4.31022 3.11613C4.31022 3.77097 3.81114 4.3129 3.10789 4.3129ZM11.9779 11.9H9.9135V8.67097C9.9135 7.90323 9.89082 6.8871 8.82461 6.8871C7.73571 6.8871 7.57691 7.74516 7.57691 8.60323V11.9H5.51254V5.23871H7.53154V6.16452H7.55423C7.84914 5.62258 8.50701 5.08065 9.52785 5.08065C11.6376 5.08065 12.0232 6.43548 12.0232 8.2871V11.9H11.9779Z"
                                        />
                                    </svg>
                                </Link>
                            </div>
                            <p className="text-base text-body-color dark:text-dark-6">
                                2025 &copy;
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <span className="absolute left-0 bottom-0 z-[-1]">
                    <svg width="307" height="363" viewBox="0 0 407 463" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M264.298 132.87C264.298 132.87 334.574 168.571 351.234 229.028C367.894 289.482 326.991 353.261 326.991 353.261C326.991 353.261 259.076 319.021 242.413 258.566C225.753 198.111 264.298 132.87 264.298 132.87Z" fill="url(#paint0_linear_67_1125)" />
                        <path d="M0.367622 223.851C0.367622 223.851 7.52324 145.352 57.5213 107.5C107.517 69.6476 181.906 84.0413 181.906 84.0413C181.906 84.0413 175.233 159.806 125.237 197.661C75.2413 235.512 0.367622 223.851 0.367622 223.851Z" fill="url(#paint1_linear_67_1125)" />
                        <path d="M292.47 47.2272C292.47 72.9395 271.626 93.7837 245.913 93.7837C220.201 93.7837 199.357 72.9395 199.357 47.2272C199.357 21.5148 220.201 0.670586 245.913 0.670586C271.626 0.670586 292.47 21.5148 292.47 47.2272Z" fill="url(#paint2_linear_67_1125)" />
                        <path d="M199.357 268.773C199.357 287.392 184.263 302.486 165.644 302.486C147.024 302.486 131.93 287.392 131.93 268.773C131.93 250.154 147.024 235.06 165.644 235.06C184.263 235.06 199.357 250.154 199.357 268.773Z" fill="url(#paint3_linear_67_1125)" />
                        <path d="M22.7613 463.027H119.085L119.085 366.703C65.7749 367.249 22.7613 410.149 22.7613 463.027Z" fill="url(#paint4_linear_67_1125)" />
                        <path d="M215.409 463.027H119.085L119.085 366.703C172.395 367.249 215.409 410.149 215.409 463.027Z" fill="url(#paint5_linear_67_1125)" />
                        <defs>
                            <linearGradient id="paint0_linear_67_1125" x1="366.798" y1="283.659" x2="224.562" y2="202.521" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#181818" />
                                <stop offset="1" stopColor="#222222" />
                            </linearGradient>
                            <linearGradient id="paint1_linear_67_1125" x1="102.513" y1="72.8216" x2="79.7784" y2="234.986" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#181818" />
                                <stop offset="1" stopColor="#222222" />
                            </linearGradient>
                            <linearGradient id="paint2_linear_67_1125" x1="245.913" y1="93.7837" x2="245.913" y2="0.670586" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#181818" />
                                <stop offset="1" stopColor="#222222" />
                            </linearGradient>
                            <linearGradient id="paint3_linear_67_1125" x1="165.644" y1="302.486" x2="165.644" y2="235.06" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#181818" />
                                <stop offset="1" stopColor="#222222" />
                            </linearGradient>
                            <linearGradient id="paint4_linear_67_1125" x1="22.7613" y1="414.865" x2="119.085" y2="414.865" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#181818" />
                                <stop offset="1" stopColor="#222222" />
                            </linearGradient>
                            <linearGradient id="paint5_linear_67_1125" x1="215.409" y1="414.865" x2="119.085" y2="414.865" gradientUnits="userSpaceOnUse">
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
    )
}