import { NextRequest, NextResponse } from 'next/server'

// This is an alternative integrated approach
// To use this instead of the standalone server:
// 1. Install dependencies: whatsapp-web.js, qrcode, qrcode-terminal
// 2. Comment out the standalone server in ecosystem.config.js
// 3. Use this API route instead

let whatsappClient: any = null
let isInitializing = false
let connectionStatus = 'disconnected'
let qrCodeData: string | null = null
let messageHistory: any[] = []

async function initializeWhatsApp() {
  if (isInitializing || whatsappClient) {
    return
  }

  try {
    isInitializing = true
    connectionStatus = 'initializing'
    
    // Dynamic import to avoid server-side issues
    const { Client, LocalAuth } = await import('whatsapp-web.js')
    const QRCode = await import('qrcode')
    
    whatsappClient = new Client({
      authStrategy: new LocalAuth({
        clientId: process.env.WHATSAPP_CLIENT_ID || 'nextjs-whatsapp'
      }),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu'
        ]
      }
    })

    whatsappClient.on('qr', async (qr: string) => {
      console.log('📱 QR Code received!')
      try {
        qrCodeData = await QRCode.toDataURL(qr)
        connectionStatus = 'qr_ready'
      } catch (error) {
        console.error('QR Error:', error)
      }
    })

    whatsappClient.on('ready', () => {
      console.log('✅ WhatsApp Ready!')
      connectionStatus = 'ready'
      qrCodeData = null
    })

    whatsappClient.on('authenticated', () => {
      console.log('✅ Authenticated!')
      connectionStatus = 'authenticated'
    })

    whatsappClient.on('auth_failure', () => {
      console.log('❌ Auth failed')
      connectionStatus = 'auth_failed'
      qrCodeData = null
    })

    whatsappClient.on('disconnected', () => {
      console.log('❌ Disconnected')
      connectionStatus = 'disconnected'
      qrCodeData = null
    })

    await whatsappClient.initialize()
    
  } catch (error) {
    console.error('❌ WhatsApp initialization error:', error)
    connectionStatus = 'error'
  } finally {
    isInitializing = false
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  // Initialize WhatsApp if not already done
  if (!whatsappClient && !isInitializing) {
    initializeWhatsApp()
  }

  switch (action) {
    case 'status':
      return NextResponse.json({
        status: connectionStatus,
        isReady: connectionStatus === 'ready',
        hasQR: !!qrCodeData,
        timestamp: new Date().toISOString()
      })

    case 'qr':
      if (qrCodeData) {
        return NextResponse.json({
          success: true,
          qr: qrCodeData,
          message: 'QR ready'
        })
      } else {
        return NextResponse.json({
          success: false,
          message: 'No QR available'
        })
      }

    case 'messages':
      const storeId = searchParams.get('storeId')
      let filteredMessages = messageHistory
      
      if (storeId) {
        filteredMessages = messageHistory.filter(msg => msg.storeId === storeId)
      }
      
      return NextResponse.json({
        success: true,
        messages: filteredMessages
      })

    default:
      return NextResponse.json({
        error: 'Invalid action'
      }, { status: 400 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { number, message, storeId } = body

    if (!whatsappClient || connectionStatus !== 'ready') {
      return NextResponse.json({
        success: false,
        error: 'WhatsApp not ready - please scan QR code first'
      }, { status: 400 })
    }

    if (!number || !message) {
      return NextResponse.json({
        success: false,
        error: 'Number and message are required'
      }, { status: 400 })
    }

    // Format the number properly
    let chatId = number
    if (!chatId.includes('@')) {
      const cleanNumber = chatId.replace(/[^\d+]/g, '')
      if (!cleanNumber.startsWith('+')) {
        chatId = `+${cleanNumber}`
      } else {
        chatId = cleanNumber
      }
      chatId = `${chatId.replace('+', '')}@c.us`
    }

    console.log(`📤 Sending message to ${chatId}: ${message}`)

    const result = await whatsappClient.sendMessage(chatId, message)

    // Save to message history
    const messageRecord = {
      id: result.id._serialized,
      recipient: chatId,
      message: message,
      status: 'sent',
      sentAt: new Date().toISOString(),
      storeId: storeId || 'unknown'
    }

    messageHistory.unshift(messageRecord)

    // Keep only last 100 messages
    if (messageHistory.length > 100) {
      messageHistory = messageHistory.slice(0, 100)
    }

    console.log('✅ Message sent successfully!')

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      messageId: result.id._serialized,
      chatId: chatId
    })

  } catch (error) {
    console.error('❌ Send error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send message'
    }, { status: 500 })
  }
} 