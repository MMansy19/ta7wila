"use client"

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';


interface DeveloperContextType {
  isDeveloper: boolean;
  setIsDeveloper: (value: boolean) => void;
}

const DeveloperContext = createContext<DeveloperContextType | undefined>(undefined);


export const DeveloperProvider = ({ children }: { children: ReactNode }) => {
  const [isDeveloper, setIsDeveloper] = useState<boolean>(false);

 
  useEffect(() => {
    const storedValue = localStorage.getItem('isDeveloper');
    if (storedValue) {
      setIsDeveloper(storedValue === 'true');
    }
  }, []);

  
  const toggleDeveloper = (value: boolean) => {
    setIsDeveloper(value);
   localStorage.setItem('isDeveloper', String(value)); 
  };

  return (
    <DeveloperContext.Provider value={{ isDeveloper, setIsDeveloper: toggleDeveloper }}>
      {children}
    </DeveloperContext.Provider>
  );
};


export const useDeveloper = () => {
  const context = useContext(DeveloperContext);
  if (!context) {
    throw new Error("useDeveloper must be used within a DeveloperProvider");
  }
  return context;
};