"use client";
import { getUserProfile, User } from "@/api/profile";
import { useTranslation } from "@/context/translation-context";
import { useEffect, useState } from "react";
import AdminPlans from "./priceAdmin";
import PriceUser from "./priceUser";

export default function Price() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); 
  const translations = useTranslation();

  useEffect(() => {
    getUserProfile()
      .then((profile) => {
        setUser(profile);
      })
      .catch((error) => {
        console.error("Failed to fetch user profile:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>{translations.price.loading}</p>; 
  }

  return user?.user_type === "admin" ? <AdminPlans /> : <PriceUser />;
}

