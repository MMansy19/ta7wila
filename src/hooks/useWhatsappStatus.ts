import { useState, useEffect } from 'react';

export interface WhatsAppStatus {
  isReady: boolean;
  status: string;
  qrCodeData?: string;
  isLoading: boolean;
}

export const useWhatsappStatus = () => {
  const [whatsappStatus, setWhatsappStatus] = useState<WhatsAppStatus>({
    isReady: false,
    status: 'disconnected',
    isLoading: true
  });

  const checkWhatsappStatus = async () => {
    try {
      setWhatsappStatus(prev => ({ ...prev, isLoading: true }));
      
      const response = await fetch('/api/whatsapp?action=status');
      const data = await response.json();
      
      setWhatsappStatus({
        isReady: data.isReady || false,
        status: data.status || 'disconnected',
        qrCodeData: data.qrCodeData,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to check WhatsApp status:', error);
      setWhatsappStatus(prev => ({ 
        ...prev, 
        isReady: false, 
        status: 'disconnected',
        isLoading: false 
      }));
    }
  };

  useEffect(() => {
    // Initial check
    checkWhatsappStatus();

    // Poll status every 30 seconds
    const interval = setInterval(checkWhatsappStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  return { whatsappStatus, checkWhatsappStatus };
}; 