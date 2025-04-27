'use client'
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from "react";
import axios from "axios";
import getAuthHeaders from "@/app/[lang]/dashboard/Shared/getAuth";

interface Profile {
  id: number;
  name: string;
  mobile: string;
  email: string;
  is_developer: boolean;
  is_transactions_enabled: boolean;
  username: string;
  status: string;
  user_type: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

interface ProfileContextType {
  profile: Profile | null;
  setProfile: Dispatch<SetStateAction<Profile | null>>;
  fetchProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`, {
        headers: getAuthHeaders(),
      });
      setProfile(response.data.result);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
  
