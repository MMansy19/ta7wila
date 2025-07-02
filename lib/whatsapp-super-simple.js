const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let client = null;
let qrCodeData = null;
let isReady = false;
let connectionStatus = 'disconnected';
let messageHistory = [];

console.log('🌟 Super Simple WhatsApp Service Starting...');

// Create minimal WhatsApp client
function createClient() {
    return new Client({
        authStrategy: new LocalAuth({
            clientId: 'simple-whatsapp'
        }),
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        }
    });
}

// Simple initialization
async function initializeWhatsApp() {
    try {
        console.log('🚀 Starting WhatsApp...');
        connectionStatus = 'initializing';
        
        client = createClient();
        
        client.on('qr', async (qr) => {
            console.log('📱 QR Code received!');
            try {
                qrCodeData = await QRCode.toDataURL(qr);
                connectionStatus = 'qr_ready';
                
                // Show QR in terminal
                const qrTerminal = require('qrcode-terminal');
                qrTerminal.generate(qr, { small: true });
                console.log('✅ QR ready - scan with your phone now!');
                
            } catch (error) {
                console.error('QR Error:', error);
            }
        });
        
        client.on('ready', () => {
            console.log('✅ WhatsApp Ready!');
            isReady = true;
            connectionStatus = 'ready';
            qrCodeData = null;
        });
        
        client.on('authenticated', () => {
            console.log('✅ Authenticated!');
            connectionStatus = 'authenticated';
        });
        
        client.on('auth_failure', () => {
            console.log('❌ Auth failed');
            connectionStatus = 'auth_failed';
            qrCodeData = null;
        });
        
        client.on('disconnected', () => {
            console.log('❌ Disconnected');
            isReady = false;
            connectionStatus = 'disconnected';
            qrCodeData = null;
        });
        
        await client.initialize();
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        connectionStatus = 'error';
    }
}

// API Routes
app.get('/whatsapp/status', (req, res) => {
    res.json({
        status: connectionStatus,
        isReady: isReady,
        hasQR: !!qrCodeData,
        timestamp: new Date().toISOString()
    });
});

app.get('/whatsapp/qr', (req, res) => {
    if (qrCodeData) {
        res.json({
            success: true,
            qr: qrCodeData,
            message: 'QR ready'
        });
    } else {
        res.json({
            success: false,
            message: 'No QR available'
        });
    }
});

app.post('/whatsapp/send', async (req, res) => {
    try {
        const { number, message } = req.body;
        
        console.log(`📤 Sending message to ${number}: ${message}`);
        
        if (!isReady) {
            console.log('❌ WhatsApp not ready');
            return res.status(400).json({
                success: false,
                error: 'WhatsApp not ready - please scan QR code first'
            });
        }
        
        if (!number || !message) {
            return res.status(400).json({
                success: false,
                error: 'Number and message are required'
            });
        }
        
        // Format the number properly
        let chatId = number;
        if (!chatId.includes('@')) {
            // Remove any non-digit characters except +
            const cleanNumber = chatId.replace(/[^\d+]/g, '');
            // Add country code if missing
            if (!cleanNumber.startsWith('+')) {
                chatId = `+${cleanNumber}`;
            } else {
                chatId = cleanNumber;
            }
            chatId = `${chatId.replace('+', '')}@c.us`;
        }
        
        console.log(`📱 Formatted chat ID: ${chatId}`);
        
        const result = await client.sendMessage(chatId, message);
        
        console.log('✅ Message sent successfully!');
        
        // Save to message history
        const messageRecord = {
            id: result.id._serialized,
            recipient: chatId,
            message: message,
            status: 'sent',
            sentAt: new Date().toISOString(),
            storeId: req.body.storeId || 'unknown'
        };
        
        messageHistory.unshift(messageRecord);
        
        // Keep only last 100 messages
        if (messageHistory.length > 100) {
            messageHistory = messageHistory.slice(0, 100);
        }
        
        res.json({
            success: true,
            message: 'Message sent successfully',
            messageId: result.id._serialized,
            chatId: chatId
        });
        
    } catch (error) {
        console.error('❌ Send error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to send message'
        });
    }
});

app.get('/whatsapp/messages', (req, res) => {
    const { storeId } = req.query;
    
    let filteredMessages = messageHistory;
    
    if (storeId) {
        filteredMessages = messageHistory.filter(msg => msg.storeId === storeId);
    }
    
    res.json({
        success: true,
        messages: filteredMessages
    });
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK',
        whatsapp: connectionStatus,
        messagesCount: messageHistory.length
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🌐 Service running on http://localhost:${PORT}`);
    
    // Start WhatsApp
    setTimeout(() => {
        initializeWhatsApp();
    }, 1000);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('🛑 Stopping...');
    if (client) {
        try {
            await client.destroy();
        } catch (e) {
            // ignore
        }
    }
    process.exit(0);
}); 