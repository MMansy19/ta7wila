"use client";
import { getUserProfile, User } from "@/api/profile";
import { useTranslation } from "@/context/translation-context";
import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";

// Dynamically import components with loading states
const AdminPlans = dynamic(() => import('./priceAdmin'), {
  loading: () => <p>Loading admin plans...</p>,
  ssr: false
});

const PriceUser = dynamic(() => import('./priceUser'), {
  loading: () => <p>Loading user plans...</p>,
  ssr: false
});

export default function Price() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const translations = useTranslation();

  useEffect(() => {
    getUserProfile()
      .then((profile) => {
        setUser(profile);
      })
      .catch((error) => {
        console.error("Failed to fetch user profile:", error);
        setError("Failed to load user profile");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>{translations.price.loading}</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return user?.user_type === "admin" ? <AdminPlans /> : <PriceUser />;
}

