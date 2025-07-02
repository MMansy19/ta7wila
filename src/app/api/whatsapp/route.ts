import { NextRequest, NextResponse } from 'next/server';

const WHATSAPP_SERVICE_URL = 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'status':
        const statusRes = await fetch(`${WHATSAPP_SERVICE_URL}/whatsapp/status`);
        const statusResult = await statusRes.json();
        return NextResponse.json(statusResult);

      case 'qr':
        const qrRes = await fetch(`${WHATSAPP_SERVICE_URL}/whatsapp/qr`);
        const qrResult = await qrRes.json();
        return NextResponse.json(qrResult);

      case 'getSessions':
        // Check status first, then return session data
        const sessionStatusRes = await fetch(`${WHATSAPP_SERVICE_URL}/whatsapp/status`);
        const sessionStatusResult = await sessionStatusRes.json();
        return NextResponse.json({ 
          success: true, 
          sessions: [{ 
            id: 'main', 
            isConnected: sessionStatusResult.isReady || false,
            lastActivity: new Date().toISOString()
          }] 
        });

      case 'getMessages':
        const storeId = searchParams.get('storeId');
        const messagesUrl = storeId 
          ? `${WHATSAPP_SERVICE_URL}/whatsapp/messages?storeId=${storeId}`
          : `${WHATSAPP_SERVICE_URL}/whatsapp/messages`;
          
        const messagesRes = await fetch(messagesUrl);
        const messagesResult = await messagesRes.json();
        return NextResponse.json(messagesResult);

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
        const sendRes = await fetch(`${WHATSAPP_SERVICE_URL}/whatsapp/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
        const sendResult = await sendRes.json();
        return NextResponse.json(sendResult);

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
        
        const messageRes = await fetch(`${WHATSAPP_SERVICE_URL}/whatsapp/send`, {
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
        
        const messageResult = await messageRes.json();
        
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

      case 'disconnect':
        const disconnectRes = await fetch(`${WHATSAPP_SERVICE_URL}/whatsapp/disconnect`, {
          method: 'POST',
        });
        const disconnectResult = await disconnectRes.json();
        return NextResponse.json(disconnectResult);

      case 'connect':
      case 'initialize':
        const connectRes = await fetch(`${WHATSAPP_SERVICE_URL}/whatsapp/connect`, {
          method: 'POST',
        });
        const connectResult = await connectRes.json();
        return NextResponse.json(connectResult);

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