const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.WHATSAPP_PORT || process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let client = null;
let qrCodeData = null;
let isReady = false;
let connectionStatus = 'disconnected';
let messageHistory = [];

console.log('🌟 Super Simple WhatsApp Service Starting...');

// Create minimal WhatsApp client with enhanced VPS support
function createClient() {
    return new Client({
        authStrategy: new LocalAuth({
            clientId: process.env.WHATSAPP_CLIENT_ID || 'simple-whatsapp'
        }),
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-web-security',
                '--disable-extensions',
                '--no-first-run',
                '--disable-default-apps',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--disable-features=TranslateUI,VizDisplayCompositor',
                '--disable-ipc-flooding-protection',
                '--disable-accelerated-2d-canvas',
                '--no-zygote',
                '--single-process',
                '--disable-sync',
                '--disable-translate',
                '--hide-scrollbars',
                '--mute-audio',
                '--no-default-browser-check',
                '--no-pings',
                '--disable-notifications',
                '--disable-component-extensions-with-background-pages',
                '--disable-background-networking',
                '--disable-client-side-phishing-detection',
                '--disable-hang-monitor',
                '--disable-popup-blocking',
                '--disable-prompt-on-repost',
                '--disable-domain-reliability',
                '--disable-component-update',
                '--memory-pressure-off',
                '--max_old_space_size=2048'
            ],
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || 
                          (process.platform === 'linux' ? 
                              findChrome() : undefined),
            timeout: 60000,
            handleSIGINT: false,
            handleSIGTERM: false,
            handleSIGHUP: false
        }
    });
}

// Find Chrome executable on Linux
function findChrome() {
    const possiblePaths = [
        '/usr/bin/google-chrome',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium',
        '/snap/bin/chromium'
    ];
    
    const fs = require('fs');
    for (const path of possiblePaths) {
        try {
            if (fs.existsSync(path)) {
                console.log(`✅ Found Chrome at: ${path}`);
                return path;
            }
        } catch (error) {
            // Continue searching
        }
    }
    
    console.log('⚠️  Chrome not found, using default');
    return undefined;
}

// Enhanced initialization with retry logic
async function initializeWhatsApp() {
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
        try {
            console.log(`🚀 Starting WhatsApp... (Attempt ${retryCount + 1}/${maxRetries})`);
            connectionStatus = 'initializing';
            
            // Clean up previous client if exists
            if (client) {
                try {
                    await client.destroy();
                } catch (e) {
                    console.log('⚠️  Previous client cleanup error:', e.message);
                }
            }
            
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
                retryCount = 0; // Reset retry count on success
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
            
            client.on('disconnected', (reason) => {
                console.log('❌ Disconnected:', reason);
                isReady = false;
                connectionStatus = 'disconnected';
                qrCodeData = null;
                
                // Auto-reconnect after disconnection
                if (reason !== 'LOGOUT') {
                    console.log('🔄 Auto-reconnecting in 5 seconds...');
                    setTimeout(() => {
                        if (connectionStatus === 'disconnected') {
                            initializeWhatsApp();
                        }
                    }, 5000);
                }
            });
            
            // Set initialization timeout
            const initTimeout = setTimeout(() => {
                console.log('⏰ Initialization timeout');
                if (connectionStatus === 'initializing') {
                    connectionStatus = 'timeout';
                    throw new Error('Initialization timeout');
                }
            }, 60000);
            
            await client.initialize();
            clearTimeout(initTimeout);
            break; // Success, exit retry loop
            
        } catch (error) {
            console.error(`❌ Error (Attempt ${retryCount + 1}):`, error.message);
            connectionStatus = 'error';
            retryCount++;
            
            if (retryCount < maxRetries) {
                console.log(`⏳ Retrying in ${retryCount * 5} seconds...`);
                await new Promise(resolve => setTimeout(resolve, retryCount * 5000));
            } else {
                console.log('❌ Max retries reached, giving up');
                connectionStatus = 'failed';
                break;
            }
        }
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
    if (!qrCodeData) {
        return res.json({
            success: false,
            hasQR: false,
            qrCode: '',
            message: 'No QR Code in memory',
            timestamp: new Date().toLocaleString()
        });
    }

    return res.json({
        success: true,
        hasQR: true,
        qrCode: qrCodeData,
        message: 'QR ready',
        timestamp: new Date().toLocaleString()
    });
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
app.listen(PORT, '0.0.0.0', () => {
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