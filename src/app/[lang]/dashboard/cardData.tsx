import { useDeveloper } from "@/context/DeveloperContext";
import { useTranslation } from "@/context/translation-context";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import getAuthHeaders from "../dashboard/Shared/getAuth";
import useCurrency from "../dashboard/Shared/useCurrency";

interface SummaryData {
  total_amount: number;
  total_pending_amount: number;
  total_transactions: number;
  total_applications: number;
  total_inactive_application: number;
  user: string | null;
  success: boolean;
  result: any;
}

const DashboardCards = () => {
  const translations = useTranslation();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { isDeveloper, setIsDeveloper } = useDeveloper();
  const formatCurrency = useCurrency();

  React.useEffect(() => {
    const isDev = localStorage.getItem("isDeveloper") === "true";
    setIsDeveloper(isDev);
  }, [setIsDeveloper]);

  async function getSummery() {
    const response = await fetch(`${apiUrl}/user-summary`, {
      headers: getAuthHeaders(),
    });
    const data: SummaryData = await response.json();
    return data;
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["summary"],
    queryFn: getSummery,
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 items-center my-3 w-full ">
      <div className="relative">
        <svg width="186" height="149" viewBox="0 0 186 159" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path fillRule="evenodd" clipRule="evenodd" d="M121.886 27.0857C121.886 12.1267 109.759 0 94.8 0H27.0857C12.1267 0 0 12.1267 0 27.0857V130.914C0 145.873 12.1267 158 27.0857 158H158C172.959 158 185.086 145.873 185.086 130.914V90.2857C185.086 75.3267 172.959 63.2 158 63.2H148.971C134.012 63.2 121.886 51.0733 121.886 36.1143V27.0857Z" fill="#F58C7B" />
          <path d="M156.301 130.645C156.301 130.645 162.157 133.62 163.546 138.658C164.934 143.696 161.525 149.011 161.525 149.011C161.525 149.011 155.866 146.158 154.477 141.12C153.089 136.082 156.301 130.645 156.301 130.645Z" fill="white" />
          <path d="M134.307 138.227C134.307 138.227 134.903 131.685 139.07 128.531C143.236 125.377 149.435 126.576 149.435 126.576C149.435 126.576 148.879 132.89 144.713 136.044C140.546 139.199 134.307 138.227 134.307 138.227Z" fill="white" />
          <path d="M158.649 123.508C158.649 125.651 156.912 127.388 154.769 127.388C152.626 127.388 150.889 125.651 150.889 123.508C150.889 121.366 152.626 119.628 154.769 119.628C156.912 119.628 158.649 121.366 158.649 123.508Z" fill="white" />
          <path d="M150.889 141.97C150.889 143.522 149.631 144.78 148.08 144.78C146.528 144.78 145.27 143.522 145.27 141.97C145.27 140.419 146.528 139.161 148.08 139.161C149.631 139.161 150.889 140.419 150.889 141.97Z" fill="white" />
          <path d="M136.173 158.158H144.2V150.131C139.757 150.177 136.173 153.752 136.173 158.158Z" fill="white" />
          <path d="M152.227 158.158H144.2V150.131C148.643 150.177 152.227 153.752 152.227 158.158Z" fill="white" />
          <rect x="135.429" width="48" height="48" rx="24" fill="#181818" />
          <path fillRule="evenodd" clipRule="evenodd" d="M169.429 23.9998C169.429 29.5226 164.952 33.9998 159.429 33.9998C153.906 33.9998 149.429 29.5226 149.429 23.9998C149.429 18.4769 153.906 13.9998 159.429 13.9998C164.952 13.9998 169.429 18.4769 169.429 23.9998ZM155.804 23.9997C155.804 23.6545 156.084 23.3747 156.429 23.3747H157.849C157.971 22.9146 158.034 22.4374 158.034 21.9544V21.3842C158.034 20.2744 158.934 19.3746 160.044 19.3746C161.154 19.3746 162.054 20.2744 162.054 21.3842V21.882C162.054 22.2272 161.774 22.507 161.429 22.507C161.084 22.507 160.804 22.2272 160.804 21.882V21.3842C160.804 20.9647 160.464 20.6246 160.044 20.6246C159.625 20.6246 159.284 20.9647 159.284 21.3842V21.9544C159.284 22.435 159.233 22.9109 159.134 23.3747H160.429C160.774 23.3747 161.054 23.6545 161.054 23.9997C161.054 24.3449 160.774 24.6247 160.429 24.6247H158.737C158.467 25.2545 158.102 25.8446 157.649 26.3726C157.311 26.7662 157.59 27.3746 158.109 27.3746H161.429C161.774 27.3746 162.054 27.6545 162.054 27.9996C162.054 28.3448 161.774 28.6246 161.429 28.6246H158.109C156.522 28.6246 155.667 26.7628 156.7 25.5585C156.949 25.2684 157.166 24.9552 157.348 24.6247H156.429C156.084 24.6247 155.804 24.3449 155.804 23.9997Z" fill="#A7A4A4" />
          <text x="40%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="17" fontWeight="500">
            {translations.dashboard.cards.totalAmount}
          </text>
          <text
            x="35%"
            y="80%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="black"
            fontSize="20"
            fontWeight="bold"
          
          >
          {formatCurrency(data?.result.total_amount)}{" "}
          </text>

        </svg>
      </div>
      <div className="relative">
        <svg width="186" height="149" viewBox="0 0 186 159" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <g clipPath="url(#clip0_150_617)">
            <path fillRule="evenodd" clipRule="evenodd" d="M121.971 27.0857C121.971 12.1267 109.845 0 94.8857 0H27.1714C12.2124 0 0.0856934 12.1267 0.0856934 27.0857V130.914C0.0856934 145.873 12.2123 158 27.1714 158H158.086C173.045 158 185.171 145.873 185.171 130.914L185.171 90.2857C185.171 75.3267 173.045 63.2 158.086 63.2H149.057C134.098 63.2 121.971 51.0733 121.971 36.1143V27.0857Z" fill="#53B4AB" />
            <path d="M156.387 130.645C156.387 130.645 162.243 133.62 163.631 138.658C165.02 143.696 161.611 149.011 161.611 149.011C161.611 149.011 155.951 146.158 154.563 141.12C153.174 136.082 156.387 130.645 156.387 130.645Z" fill="white" />
            <path d="M134.393 138.227C134.393 138.227 134.989 131.685 139.155 128.531C143.322 125.377 149.521 126.576 149.521 126.576C149.521 126.576 148.965 132.89 144.798 136.044C140.632 139.199 134.393 138.227 134.393 138.227Z" fill="white" />
            <path d="M158.734 123.508C158.734 125.651 156.997 127.388 154.855 127.388C152.712 127.388 150.975 125.651 150.975 123.508C150.975 121.366 152.712 119.628 154.855 119.628C156.997 119.628 158.734 121.366 158.734 123.508Z" fill="white" />
            <path d="M150.975 141.97C150.975 143.522 149.717 144.78 148.165 144.78C146.614 144.78 145.356 143.522 145.356 141.97C145.356 140.419 146.614 139.161 148.165 139.161C149.717 139.161 150.975 140.419 150.975 141.97Z" fill="white" />
            <path d="M136.259 158.158H144.286V150.131C139.843 150.177 136.259 153.752 136.259 158.158Z" fill="white" />
            <path d="M152.313 158.158H144.286V150.131C148.728 150.177 152.313 153.752 152.313 158.158Z" fill="white" />
            <rect x="135.514" width="48" height="48" rx="24" fill="#181818" />
            <path fillRule="evenodd" clipRule="evenodd" d="M151.145 14C150.106 14 149.264 14.8421 149.264 15.881V20.119C149.264 21.1579 150.106 22 151.145 22H157.383C158.422 22 159.264 21.1579 159.264 20.119V15.881C159.264 14.8421 158.422 14 157.383 14H151.145ZM161.145 26C160.106 26 159.264 26.8422 159.264 27.881V32.1191C159.264 33.1579 160.106 34 161.145 34H167.383C168.422 34 169.264 33.1579 169.264 32.1191V27.881C169.264 26.8422 168.422 26 167.383 26H161.145ZM167.868 18.7502L167.148 19.4699C166.855 19.7628 166.855 20.2377 167.148 20.5305C167.441 20.8234 167.916 20.8234 168.209 20.5305L169.502 19.2377C170.185 18.5542 170.185 17.4462 169.502 16.7628L168.209 15.4699C167.916 15.177 167.441 15.177 167.148 15.4699C166.855 15.7628 166.855 16.2377 167.148 16.5305L167.868 17.2502H163.264C162.85 17.2502 162.514 17.586 162.514 18.0002C162.514 18.4144 162.85 18.7502 163.264 18.7502H167.868ZM151.38 31.4697L150.661 30.75H155.264C155.678 30.75 156.014 30.4142 156.014 30C156.014 29.5858 155.678 29.25 155.264 29.25H150.661L151.38 28.5303C151.673 28.2375 151.673 27.7626 151.38 27.4697C151.087 27.1768 150.613 27.1768 150.32 27.4697L149.027 28.7626C148.343 29.446 148.343 30.554 149.027 31.2375L150.32 32.5303C150.613 32.8232 151.087 32.8232 151.38 32.5303C151.673 32.2375 151.673 31.7626 151.38 31.4697Z" fill="#A7A4A4" />
          </g>
          <text x="40%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="17" fontWeight="500">
            {translations.dashboard.cards.pendingAmount} 
          </text>
          <text
            x="35%"
            y="80%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="black"
            fontSize="20"
            fontWeight="bold"
          >
           {formatCurrency(data?.result.total_pending_amount)}{" "}
          </text>

        </svg>


      </div>
      <div className="relative">
        <svg width="186" height="149" viewBox="0 0 186 159" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path fillRule="evenodd" clipRule="evenodd" d="M122.057 27.0857C122.057 12.1267 109.93 0 94.9714 0H27.2571C12.2981 0 0.171387 12.1267 0.171387 27.0857V130.914C0.171387 145.873 12.298 158 27.2571 158H158.171C173.13 158 185.257 145.873 185.257 130.914V90.2857C185.257 75.3267 173.13 63.2 158.171 63.2H149.143C134.184 63.2 122.057 51.0733 122.057 36.1143V27.0857Z" fill="#777777" />
          <path d="M156.472 130.645C156.472 130.645 162.329 133.62 163.717 138.658C165.105 143.696 161.697 149.011 161.697 149.011C161.697 149.011 156.037 146.158 154.649 141.12C153.26 136.082 156.472 130.645 156.472 130.645Z" fill="white" />
          <path d="M134.478 138.227C134.478 138.227 135.075 131.685 139.241 128.531C143.407 125.377 149.606 126.576 149.606 126.576C149.606 126.576 149.05 132.89 144.884 136.044C140.718 139.199 134.478 138.227 134.478 138.227Z" fill="white" />
          <path d="M158.82 123.508C158.82 125.651 157.083 127.388 154.94 127.388C152.798 127.388 151.061 125.651 151.061 123.508C151.061 121.366 152.798 119.628 154.94 119.628C157.083 119.628 158.82 121.366 158.82 123.508Z" fill="white" />
          <path d="M151.061 141.97C151.061 143.522 149.803 144.78 148.251 144.78C146.699 144.78 145.442 143.522 145.442 141.97C145.442 140.419 146.699 139.161 148.251 139.161C149.803 139.161 151.061 140.419 151.061 141.97Z" fill="white" />
          <path d="M136.344 158.158H144.371V150.131C139.929 150.177 136.344 153.752 136.344 158.158Z" fill="white" />
          <path d="M152.398 158.158H144.371V150.131C148.814 150.177 152.398 153.752 152.398 158.158Z" fill="white" />
          <rect x="135.514" width="48" height="48" rx="24" fill="#181818" />
          <path d="M159.514 25V30M168.514 22.1503V29.9668C168.514 32.1943 166.723 34 164.514 34H154.514C152.305 34 150.514 32.1943 150.514 29.9668V22.1503C150.514 20.9394 151.054 19.7925 151.984 19.0265L156.984 14.9093C158.456 13.6969 160.572 13.6969 162.044 14.9093L167.044 19.0265C167.975 19.7925 168.514 20.9394 168.514 22.1503Z" stroke="#A7A4A4" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M160.514 22C160.514 22.5523 160.066 23 159.514 23C158.962 23 158.514 22.5523 158.514 22C158.514 21.4477 158.962 21 159.514 21C160.066 21 160.514 21.4477 160.514 22Z" fill="#A7A4A4" />
          <text x="40%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="17" fontWeight="500">
            {translations.dashboard.cards.totalTransactions}
          </text>
          <text
            x="35%"
            y="80%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="black"
            fontSize="20"
            fontWeight="bold"
        
          >
            {" "}
            {data?.result.total_transactions}{"   "}<tspan fontSize="12" dx="3" dy="3">{translations.dashboard.cards.time}</tspan>
          </text>

        </svg>


      </div>
      <div className="relative">
        <svg width="186" height="149" viewBox="0 0 186 159" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <g clipPath="url(#clip0_150_650)">
            <path fillRule="evenodd" clipRule="evenodd" d="M122.143 27.0857C122.143 12.1267 110.016 0 95.0571 0H27.3428C12.3838 0 0.25708 12.1267 0.25708 27.0857V130.914C0.25708 145.873 12.3837 158 27.3428 158H158.257C173.216 158 185.343 145.873 185.343 130.914L185.343 90.2857C185.343 75.3267 173.216 63.2 158.257 63.2H149.229C134.27 63.2 122.143 51.0733 122.143 36.1143V27.0857Z" fill="#777777" />
            <path d="M156.558 130.645C156.558 130.645 162.414 133.62 163.803 138.658C165.191 143.696 161.783 149.011 161.783 149.011C161.783 149.011 156.123 146.158 154.734 141.12C153.346 136.082 156.558 130.645 156.558 130.645Z" fill="white" />
            <path d="M134.564 138.227C134.564 138.227 135.16 131.685 139.327 128.531C143.493 125.377 149.692 126.576 149.692 126.576C149.692 126.576 149.136 132.89 144.97 136.044C140.803 139.199 134.564 138.227 134.564 138.227Z" fill="white" />
            <path d="M158.906 123.508C158.906 125.651 157.169 127.388 155.026 127.388C152.883 127.388 151.146 125.651 151.146 123.508C151.146 121.366 152.883 119.628 155.026 119.628C157.169 119.628 158.906 121.366 158.906 123.508Z" fill="white" />
            <path d="M151.146 141.97C151.146 143.522 149.888 144.78 148.337 144.78C146.785 144.78 145.527 143.522 145.527 141.97C145.527 140.419 146.785 139.161 148.337 139.161C149.888 139.161 151.146 140.419 151.146 141.97Z" fill="white" />
            <path d="M136.43 158.158H144.457V150.131C140.015 150.177 136.43 153.752 136.43 158.158Z" fill="white" />
            <path d="M152.484 158.158H144.457V150.131C148.9 150.177 152.484 153.752 152.484 158.158Z" fill="white" />
            <rect x="135.514" width="48" height="48" rx="24" fill="#181818" />
            <path d="M156.514 26L157.789 27.2749C158.682 28.1674 160.167 28.0202 160.868 26.9701L163.514 23M168.514 22.1503V29.9668C168.514 32.1943 166.723 34 164.514 34H154.514C152.305 34 150.514 32.1943 150.514 29.9668V22.1503C150.514 20.9394 151.054 19.7925 151.984 19.0265L156.984 14.9093C158.457 13.6969 160.572 13.6969 162.044 14.9093L167.044 19.0265C167.975 19.7925 168.514 20.9394 168.514 22.1503Z" stroke="#A7A4A4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <defs>
            <clipPath id="clip0_150_650">
              <rect width="185.086" height="158" fill="white" transform="translate(0.25708)" />
            </clipPath>
          </defs>
          <text x="40%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="17" fontWeight="500">
            {translations.dashboard.cards.activeStores}
          </text>
          <text
            x="35%"
            y="80%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="black"
            fontSize="20"
            fontWeight="bold"
          >
            {data?.result.total_applications}{" "}<tspan fontSize="12" dx="3" dy="3">{translations.dashboard.cards.store}</tspan>
          </text>
        </svg>
      </div>
      {!isDeveloper ? (
        <div className="relative">

          <div className="absolute z-10 flex items-center justify-center w-full h-full">
            <svg width="186" height="149" viewBox="0 0 186 159" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <g clipPath="url(#clip0_150_650)">
                <path fillRule="evenodd" clipRule="evenodd" d="M122.143 27.0857C122.143 12.1267 110.016 0 95.0571 0H27.3428C12.3838 0 0.25708 12.1267 0.25708 27.0857V130.914C0.25708 145.873 12.3837 158 27.3428 158H158.257C173.216 158 185.343 145.873 185.343 130.914L185.343 90.2857C185.343 75.3267 173.216 63.2 158.257 63.2H149.229C134.27 63.2 122.143 51.0733 122.143 36.1143V27.0857Z" fill="#777777" />
                <path d="M156.558 130.645C156.558 130.645 162.414 133.62 163.803 138.658C165.191 143.696 161.783 149.011 161.783 149.011C161.783 149.011 156.123 146.158 154.734 141.12C153.346 136.082 156.558 130.645 156.558 130.645Z" fill="white" />
                <path d="M134.564 138.227C134.564 138.227 135.16 131.685 139.327 128.531C143.493 125.377 149.692 126.576 149.692 126.576C149.692 126.576 149.136 132.89 144.97 136.044C140.803 139.199 134.564 138.227 134.564 138.227Z" fill="white" />
                <path d="M158.906 123.508C158.906 125.651 157.169 127.388 155.026 127.388C152.883 127.388 151.146 125.651 151.146 123.508C151.146 121.366 152.883 119.628 155.026 119.628C157.169 119.628 158.906 121.366 158.906 123.508Z" fill="white" />
                <path d="M151.146 141.97C151.146 143.522 149.888 144.78 148.337 144.78C146.785 144.78 145.527 143.522 145.527 141.97C145.527 140.419 146.785 139.161 148.337 139.161C149.888 139.161 151.146 140.419 151.146 141.97Z" fill="white" />
                <path d="M136.43 158.158H144.457V150.131C140.015 150.177 136.43 153.752 136.43 158.158Z" fill="white" />
                <path d="M152.484 158.158H144.457V150.131C148.9 150.177 152.484 153.752 152.484 158.158Z" fill="white" />
                <rect x="135.514" width="48" height="48" rx="24" fill="#181818" />
                <path d="M156.514 26L157.789 27.2749C158.682 28.1674 160.167 28.0202 160.868 26.9701L163.514 23M168.514 22.1503V29.9668C168.514 32.1943 166.723 34 164.514 34H154.514C152.305 34 150.514 32.1943 150.514 29.9668V22.1503C150.514 20.9394 151.054 19.7925 151.984 19.0265L156.984 14.9093C158.457 13.6969 160.572 13.6969 162.044 14.9093L167.044 19.0265C167.975 19.7925 168.514 20.9394 168.514 22.1503Z" stroke="#A7A4A4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </g>
              <defs>
                <clipPath id="clip0_150_650">
                  <rect width="185.086" height="158" fill="white" transform="translate(0.25708)" />
                </clipPath>
              </defs>
              <text x="40%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="17" fontWeight="500">
                {translations.dashboard.cards.totalCashback}
              </text>
              <text
                x="35%"
                y="80%"
                dominantBaseline="middle"
                textAnchor="middle"
                fill="black"
                fontSize="20"
                fontWeight="bold"
                className="px-2"
              >
               {formatCurrency(data?.result?.total_developer_fees)}
              </text>
            </svg>
          </div>
          <div className="relative items-center justify-center text-center z-20 flex h-full">
            <svg width="186" height="153" viewBox="0 0 186 158" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <g filter="url(#filter0_b_149_578)">
                <rect width="186" height="158" rx="26" fill="black" fillOpacity="0.95" />
              </g>
              <defs>
                <filter id="filter0_b_149_578" x="-10" y="-10" width="206" height="178" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feGaussianBlur in="BackgroundImageFix" stdDeviation="5" />
                  <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_149_578" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_149_578" result="shape" />
                </filter>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              {translations.dashboard.cards.devMode.switch} <br />
              <span className="text-2xl font-semibold">{translations.dashboard.cards.devMode.mode}</span>
              <br />
              {translations.dashboard.cards.devMode.view}
            </div>
          </div>
        </div>

      ) : (
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <svg width="186" height="149" viewBox="0 0 186 159" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <g clipPath="url(#clip0_150_650)">
              <path fillRule="evenodd" clipRule="evenodd" d="M122.143 27.0857C122.143 12.1267 110.016 0 95.0571 0H27.3428C12.3838 0 0.25708 12.1267 0.25708 27.0857V130.914C0.25708 145.873 12.3837 158 27.3428 158H158.257C173.216 158 185.343 145.873 185.343 130.914L185.343 90.2857C185.343 75.3267 173.216 63.2 158.257 63.2H149.229C134.27 63.2 122.143 51.0733 122.143 36.1143V27.0857Z" fill="#777777" />
              <path d="M156.558 130.645C156.558 130.645 162.414 133.62 163.803 138.658C165.191 143.696 161.783 149.011 161.783 149.011C161.783 149.011 156.123 146.158 154.734 141.12C153.346 136.082 156.558 130.645 156.558 130.645Z" fill="white" />
              <path d="M134.564 138.227C134.564 138.227 135.16 131.685 139.327 128.531C143.493 125.377 149.692 126.576 149.692 126.576C149.692 126.576 149.136 132.89 144.97 136.044C140.803 139.199 134.564 138.227 134.564 138.227Z" fill="white" />
              <path d="M158.906 123.508C158.906 125.651 157.169 127.388 155.026 127.388C152.883 127.388 151.146 125.651 151.146 123.508C151.146 121.366 152.883 119.628 155.026 119.628C157.169 119.628 158.906 121.366 158.906 123.508Z" fill="white" />
              <path d="M151.146 141.97C151.146 143.522 149.888 144.78 148.337 144.78C146.785 144.78 145.527 143.522 145.527 141.97C145.527 140.419 146.785 139.161 148.337 139.161C149.888 139.161 151.146 140.419 151.146 141.97Z" fill="white" />
              <path d="M136.43 158.158H144.457V150.131C140.015 150.177 136.43 153.752 136.43 158.158Z" fill="white" />
              <path d="M152.484 158.158H144.457V150.131C148.9 150.177 152.484 153.752 152.484 158.158Z" fill="white" />
              <rect x="135.514" width="48" height="48" rx="24" fill="#181818" />
              <path d="M156.514 26L157.789 27.2749C158.682 28.1674 160.167 28.0202 160.868 26.9701L163.514 23M168.514 22.1503V29.9668C168.514 32.1943 166.723 34 164.514 34H154.514C152.305 34 150.514 32.1943 150.514 29.9668V22.1503C150.514 20.9394 151.054 19.7925 151.984 19.0265L156.984 14.9093C158.457 13.6969 160.572 13.6969 162.044 14.9093L167.044 19.0265C167.975 19.7925 168.514 20.9394 168.514 22.1503Z" stroke="#A7A4A4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <defs>
              <clipPath id="clip0_150_650">
                <rect width="185.086" height="158" fill="white" transform="translate(0.25708)" />
              </clipPath>
            </defs>
            <text x="40%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="17" fontWeight="500">
              {translations.dashboard.cards.totalCashback}
            </text>
            <text
              x="35%"
              y="80%"
              dominantBaseline="middle"
              textAnchor="middle"
              fill="black"
              fontSize="20"
              fontWeight="bold"
              className="px-2"
            >
            {formatCurrency(data?.result?.total_developer_fees)}{" "}
            </text>
          </svg>
        </div>
      )}
    </div>
  );
};

export default DashboardCards;
