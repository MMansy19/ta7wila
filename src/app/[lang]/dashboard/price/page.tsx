"use client";
import { useProfile } from "@/context/ProfileContext";
import { useTranslation } from "@/context/translation-context";
import dynamic from 'next/dynamic';
import { useState } from "react";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const translations = useTranslation();
  const { profile } = useProfile();
 

  if (loading) {
    return <p>{translations.price.loading}</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return profile?.user_type === "admin" ? <AdminPlans /> : <PriceUser />;
}

