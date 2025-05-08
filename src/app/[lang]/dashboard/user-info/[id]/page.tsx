"use client";
import { useEffect, useState } from 'react';
import UserInfoClient from './UserInfoClient';

interface Params {
  id: string;
  lang: string;
}

export default function Page({ params }: { params: Promise<Params> }) {
  const [resolvedParams, setResolvedParams] = useState<Params | null>(null);
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolved = await params;
        setResolvedParams(resolved);
      } catch (err) {
        console.error("Error resolving params:", err);
      }
    };

    resolveParams();
  }, [params]);

  if (!resolvedParams) {
    return <div>Loading...</div>;
  }

  return <UserInfoClient id={resolvedParams.id} />;
}


