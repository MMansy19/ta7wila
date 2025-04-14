import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import Cookies from 'cookies-next';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';

interface UserProfile {
  name: string;
  email: string;
  role: string; 
}

interface UserContextType {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  clearUserProfile: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const storedProfile = getCookie('userProfile');
    if (storedProfile) {
      try {
        setUserProfile(JSON.parse(storedProfile as string));
      } catch {
        console.error("Failed to parse user profile from cookies.");
      }
    }
  }, []);

  const updateUserProfile = (profile: UserProfile | null) => {
    if (profile) {
      setUserProfile(profile);
     
    } else {
      setUserProfile(null);
    
    }
  };

  const clearUserProfile = () => {
    setUserProfile(null);
  
  };

  return (
    <UserContext.Provider
      value={{ userProfile, setUserProfile: updateUserProfile, clearUserProfile }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useClient = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useClient must be used within a UserProvider');
  }
  return context;
};
