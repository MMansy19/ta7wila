// WhatsApp Service Configuration
export const WHATSAPP_CONFIG = {
  // Set to 'mock' to use mock service when backend is unavailable
  // Set to 'real' to use actual WhatsApp backend service
  mode: process.env.NEXT_WHATSAPP_MODE || 'real',
  
  // Real WhatsApp service URL
  serviceUrl: process.env.NEXT_WHATSAPP_SERVICE_URL || 'http://localhost:3001',
  
  // Mock service responses
  mockResponses: {
    status: {
      isReady: false,
      status: 'disconnected',
      message: 'Mock WhatsApp service - Backend not available'
    },
    qr: {
      success: false,
      error: 'WhatsApp backend service not available'
    },
    messages: {
      success: true,
      messages: []
    },
    sessions: {
      success: true,
      sessions: []
    }
  }
};
