"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import getAuthHeaders from "../app/[lang]/dashboard/Shared/getAuth";

interface WiFiContextType {
  isWiFiEnabled: boolean;
  toggleWiFi: () => Promise<void>;
}

const WiFiContext = createContext<WiFiContextType | undefined>(undefined);

export const WiFiProvider = ({ children }: { children: ReactNode }) => {
  const [isWiFiEnabled, setIsWiFiEnabled] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const toggleWiFi = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/transactions/is-enabled`,
        {},
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        setIsWiFiEnabled(!isWiFiEnabled); // Toggle locally
        toast.success(
          !isWiFiEnabled ? "WiFi enabled" : "WiFi disabled"
        );
      }
    } catch (error) {
      toast.error("Failed to toggle WiFi");
    }
  };

  return (
    <WiFiContext.Provider value={{ isWiFiEnabled, toggleWiFi }}>
      {children}
    </WiFiContext.Provider>
  );
};

export const useWiFi = () => {
  const context = useContext(WiFiContext);
  if (!context) {
    throw new Error("useWiFi must be used within a WiFiProvider");
  }
  return context;
};