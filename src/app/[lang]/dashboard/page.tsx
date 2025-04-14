"use client";
import { getUserProfile, User } from "@/api/profile";

import LastTranaction from "@/components/[lang]/lasttransaction";
import { useTranslation } from "@/context/translation-context";
import { useEffect, useState } from "react";
import DashboardCards from "./cardData";

export default function Main() {
  const [user, setUser] = useState<User | null>(null);
  const translations = useTranslation();

  useEffect(() => {
    getUserProfile().then((profile) => {
      setUser(profile);
    });
  }, []);

  return (
    <div className="min-h-screen text-white">
      <div className="mb-6">
        <div className="flex flex-col flex-1 mb-2 shrink self-stretch leading-tight basis-0 max-md:max-w-full text-white">
          <div className="text-xl bg-gradient-to-r from-white via-black text-transparent bg-clip-text">
            {translations.dashboard.welcome}
          </div>
          <div className="mt-1.5 text-3xl font-medium max-md:max-w-full">
            {user?.name ? (
              <>
                {user.name.split(" ")[0]}{" "}
                <span className="bg-gradient-to-r from-gray-100 via-gray-300 to-gray-500 text-transparent bg-clip-text">
                  {user.name.split(" ")[1] || ""}
                </span>
              </>
            ) : (
              "User"
            )}
          </div>
          <div className="mt-1.5 text-lg text-stone-500 max-md:max-w-full">
            {translations.dashboard.greeting}
          </div>
        </div>
        <DashboardCards/>
      </div>
      <LastTranaction />
    </div>
  );
}
