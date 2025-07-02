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
      
      if (!response.ok) {
        // Service unavailable
        setWhatsappStatus({
          isReady: false,
          status: 'service_unavailable',
          isLoading: false
        });
        return;
      }
      
      const data = await response.json();
      
      setWhatsappStatus({
        isReady: data.isReady || false,
        status: data.status || 'disconnected',
        qrCodeData: data.qrCodeData,
        isLoading: false
      });
    } catch (error) {
      console.warn('WhatsApp service not available:', error);
      setWhatsappStatus({
        isReady: false, 
        status: 'service_unavailable',
        isLoading: false 
      });
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