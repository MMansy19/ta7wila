"use client"

// context/TitleContext.tsx
import React, { createContext, useState, useContext } from "react";

interface TitleContextType {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}

const TitleContext = createContext<TitleContextType | undefined>(undefined);

export const TitleProvider = ({ children }: { children: React.ReactNode }) => {
  const [title, setTitle] = useState("Ta7wila"); // default title

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
};

export const useTitle = () => {
  const context = useContext(TitleContext);
  if (!context) {
    throw new Error("useTitle must be used within a TitleProvider");
  }
  return context;
};
