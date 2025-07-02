import { NextRequest, NextResponse } from 'next/server';
import { WHATSAPP_CONFIG } from '@/lib/whatsapp-config';

const WHATSAPP_SERVICE_URL = WHATSAPP_CONFIG.serviceUrl;

// Helper function to handle fetch with fallback
async function fetchWithFallback(url: string, options?: RequestInit) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`Service returned ${response.status}: ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Service returned non-JSON response');
    }
    
    return await response.json();
  } catch (error) {
    console.warn(`WhatsApp service unavailable: ${error}`);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'status':
        try {
          const statusResult = await fetchWithFallback(`${WHATSAPP_SERVICE_URL}/whatsapp/status`);
          return NextResponse.json(statusResult);
        } catch (error) {
          // Return mock status when service is unavailable
          return NextResponse.json(WHATSAPP_CONFIG.mockResponses.status);
        }

      case 'qr':
        try {
          const qrResult = await fetchWithFallback(`${WHATSAPP_SERVICE_URL}/whatsapp/qr`);
          return NextResponse.json(qrResult);
        } catch (error) {
          // Return mock QR response when service is unavailable
          return NextResponse.json(WHATSAPP_CONFIG.mockResponses.qr);
        }

      case 'getSessions':
        try {
          const sessionStatusResult = await fetchWithFallback(`${WHATSAPP_SERVICE_URL}/whatsapp/status`);
          return NextResponse.json({ 
            success: true, 
            sessions: [{ 
              id: 'main', 
              isConnected: sessionStatusResult.isReady || false,
              lastActivity: new Date().toISOString()
            }] 
          });
        } catch (error) {
          // Return empty sessions when service is unavailable
          return NextResponse.json(WHATSAPP_CONFIG.mockResponses.sessions);
        }

      case 'getMessages':
        try {
          const storeId = searchParams.get('storeId');
          const messagesUrl = storeId 
            ? `${WHATSAPP_SERVICE_URL}/whatsapp/messages?storeId=${storeId}`
            : `${WHATSAPP_SERVICE_URL}/whatsapp/messages`;
            
          const messagesResult = await fetchWithFallback(messagesUrl);
          return NextResponse.json(messagesResult);
        } catch (error) {
          // Return empty messages when service is unavailable
          return NextResponse.json(WHATSAPP_CONFIG.mockResponses.messages);
        }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('WhatsApp API Error:', error);
    return NextResponse.json({ 
      error: 'WhatsApp service not available', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'send':
        try {
          const sendResult = await fetchWithFallback(`${WHATSAPP_SERVICE_URL}/whatsapp/send`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          });
          return NextResponse.json(sendResult);
        } catch (error) {
          return NextResponse.json({ 
            success: false,
            error: 'WhatsApp service not available' 
          }, { status: 503 });
        }

      case 'sendMessage':
        // Handle sendMessage action from store details page
        const { recipient, message, sessionId, storeId } = body;
        
        if (!recipient || !message) {
          return NextResponse.json({ 
            success: false,
            error: 'Recipient and message are required' 
          }, { status: 400 });
        }

        // Format phone number for WhatsApp
        const cleanNumber = recipient.replace(/[^\d+]/g, '');
        
        try {
          const messageResult = await fetchWithFallback(`${WHATSAPP_SERVICE_URL}/whatsapp/send`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              number: cleanNumber,
              message: message,
              storeId: storeId
            }),
          });
        
          if (messageResult.success) {
            return NextResponse.json({
              success: true,
              messageId: `msg_${Date.now()}`,
              recipient: cleanNumber,
              message: message,
              sentAt: new Date().toISOString(),
              storeId: storeId
            });
          } else {
            return NextResponse.json({
              success: false,
              error: messageResult.error || 'Failed to send message'
            }, { status: 500 });
          }
        } catch (error) {
          return NextResponse.json({
            success: false,
            error: 'WhatsApp service not available'
          }, { status: 503 });
        }

      case 'disconnect':
        try {
          const disconnectResult = await fetchWithFallback(`${WHATSAPP_SERVICE_URL}/whatsapp/disconnect`, {
            method: 'POST',
          });
          return NextResponse.json(disconnectResult);
        } catch (error) {
          return NextResponse.json({ 
            success: false,
            error: 'WhatsApp service not available' 
          }, { status: 503 });
        }

      case 'connect':
      case 'initialize':
        try {
          const connectResult = await fetchWithFallback(`${WHATSAPP_SERVICE_URL}/whatsapp/connect`, {
            method: 'POST',
          });
          return NextResponse.json(connectResult);
        } catch (error) {
          return NextResponse.json({ 
            success: false,
            error: 'WhatsApp service not available' 
          }, { status: 503 });
        }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('WhatsApp API Error:', error);
    return NextResponse.json({ 
      error: 'WhatsApp service not available', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 503 });
  }
} 