"use client";
import axios from "axios";
import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-hot-toast";
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
        setIsWiFiEnabled(!isWiFiEnabled);
        toast.success(
          !isWiFiEnabled ? "WiFi enabled" : "WiFi disabled"
        );
      }
    } catch (error: unknown) {
      let errorMessage = "An unknown error occurred.";
      
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { 
          response: { 
            data?: { 
              errorMessage?: string;
              message?: string;
              result?: Record<string, string>;
            } | string;
          }
        };

        if (typeof err.response.data === "string") {
          errorMessage = err.response.data;
        } else if (err.response.data?.errorMessage) {
          errorMessage = err.response.data.errorMessage;
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data?.result) {
          errorMessage = Object.values(err.response.data.result).join(", ");
        }
      }

      toast.error("Failed to toggle WiFi: " + errorMessage);
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