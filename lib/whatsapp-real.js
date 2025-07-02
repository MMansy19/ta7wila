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
let isInitializing = false;

console.log('🎯 Real WhatsApp Service Starting...');

// Create stable WhatsApp client with better macOS support
function createClient() {
    return new Client({
        authStrategy: new LocalAuth({
            dataPath: './.wwebjs_auth',
            clientId: 'ta7wila-production'
        }),
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-extensions',
                '--disable-plugins',
                '--disable-default-apps',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--disable-features=TranslateUI',
                '--disable-ipc-flooding-protection',
                '--disable-hang-monitor',
                '--disable-client-side-phishing-detection',
                '--disable-component-update',
                '--no-first-run',
                '--no-default-browser-check',
                '--no-zygote',
                '--single-process',
                '--disable-gpu',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--user-data-dir=/tmp/chrome-user-data'
            ],
            ignoreDefaultArgs: ['--disable-extensions'],
            ignoreHTTPSErrors: true,
            slowMo: 100
        },
        webVersionCache: {
            type: 'remote',
            remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
        }
    });
}

// Initialize WhatsApp safely with retry mechanism
async function initializeWhatsApp() {
    if (isInitializing) {
        console.log('⚠️ Already initializing...');
        return;
    }
    
    try {
        isInitializing = true;
        console.log('🚀 Initializing WhatsApp...');
        connectionStatus = 'initializing';
        
        // Clean previous client
        if (client) {
            try {
                await client.destroy();
            } catch (e) {
                console.log('Cleaned previous client');
            }
            client = null;
        }
        
        client = createClient();
        
        // QR Code event - most important for linking
        client.on('qr', async (qr) => {
            try {
                console.log('📱 QR Code received!');
                qrCodeData = await QRCode.toDataURL(qr);
                connectionStatus = 'qr_ready';
                console.log('✅ QR Code ready for scan');
                
                // Display QR in terminal
                const qrTerminal = require('qrcode-terminal');
                qrTerminal.generate(qr, { small: true });
                console.log('📱 Scan the QR code above with WhatsApp');
                console.log('⏰ QR Code is valid for 30 seconds');
                
            } catch (error) {
                console.error('❌ QR generation error:', error);
            }
        });
        
        // Ready event
        client.on('ready', () => {
            console.log('✅ WhatsApp Client is ready!');
            isReady = true;
            connectionStatus = 'ready';
            qrCodeData = null;
        });
        
        // Authentication success
        client.on('authenticated', () => {
            console.log('✅ WhatsApp authenticated successfully!');
            connectionStatus = 'authenticated';
        });
        
        // Authentication failure
        client.on('auth_failure', (msg) => {
            console.log('❌ Authentication failed:', msg);
            connectionStatus = 'auth_failed';
            qrCodeData = null;
            
            // Auto-retry after auth failure
            setTimeout(() => {
                console.log('🔄 Retrying after auth failure...');
                initializeWhatsApp();
            }, 10000);
        });
        
        // Disconnected event
        client.on('disconnected', (reason) => {
            console.log('❌ WhatsApp disconnected:', reason);
            isReady = false;
            connectionStatus = 'disconnected';
            qrCodeData = null;
            
            // Auto-reconnect after disconnect
            setTimeout(() => {
                console.log('🔄 Auto-reconnecting...');
                initializeWhatsApp();
            }, 5000);
        });
        
        // Loading screen event
        client.on('loading_screen', (percent, message) => {
            console.log(`📊 Loading: ${percent}% - ${message}`);
        });
        
        // Message received event (for testing)
        client.on('message', msg => {
            console.log('📩 Message received:', msg.from);
        });
        
        // Initialize client with timeout protection
        console.log('⏳ Starting WhatsApp initialization...');
        
        // Set a timeout for initialization
        const initTimeout = setTimeout(() => {
            console.log('⏰ Initialization timeout, retrying...');
            if (client && !isReady) {
                initializeWhatsApp();
            }
        }, 60000); // 60 seconds timeout
        
        await client.initialize();
        clearTimeout(initTimeout);
        
        console.log('⏳ Waiting for QR or authentication...');
        
    } catch (error) {
        console.error('❌ Initialization error:', error);
        connectionStatus = 'error';
        isReady = false;
        qrCodeData = null;
        
        // Retry after error
        setTimeout(() => {
            console.log('🔄 Retrying after error...');
            initializeWhatsApp();
        }, 15000);
    } finally {
        isInitializing = false;
    }
}

// API Routes
app.get('/whatsapp/status', (req, res) => {
    res.json({
        status: connectionStatus,
        isReady: isReady,
        hasQR: !!qrCodeData,
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.get('/whatsapp/qr', (req, res) => {
    if (qrCodeData) {
        res.json({
            success: true,
            qr: qrCodeData,
            message: 'QR Code ready',
            timestamp: new Date().toISOString()
        });
    } else {
        res.json({
            success: false,
            message: 'No QR code available',
            status: connectionStatus
        });
    }
});

app.post('/whatsapp/send', async (req, res) => {
    try {
        const { number, message } = req.body;
        
        if (!isReady) {
            return res.status(400).json({
                success: false,
                error: 'WhatsApp not ready',
                status: connectionStatus
            });
        }
        
        if (!number || !message) {
            return res.status(400).json({
                success: false,
                error: 'Number and message required'
            });
        }
        
        const chatId = number.includes('@') ? number : `${number}@c.us`;
        await client.sendMessage(chatId, message);
        
        res.json({
            success: true,
            message: 'Message sent successfully'
        });
        
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send message',
            details: error.message
        });
    }
});

app.post('/whatsapp/restart', async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Restarting WhatsApp service...'
        });
        
        setTimeout(async () => {
            try {
                if (client) {
                    await client.destroy();
                    client = null;
                }
                isReady = false;
                qrCodeData = null;
                connectionStatus = 'restarting';
                isInitializing = false;
                
                setTimeout(() => {
                    initializeWhatsApp();
                }, 3000);
                
            } catch (error) {
                console.error('Restart error:', error);
            }
        }, 1000);
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to restart'
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK',
        service: 'WhatsApp Real Service',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        whatsapp_status: connectionStatus,
        has_qr: !!qrCodeData,
        is_ready: isReady
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🌐 WhatsApp Real Service running on http://localhost:${PORT}`);
    console.log(`📋 Available APIs:`);
    console.log(`   - GET  http://localhost:${PORT}/whatsapp/status`);
    console.log(`   - GET  http://localhost:${PORT}/whatsapp/qr`);
    console.log(`   - POST http://localhost:${PORT}/whatsapp/send`);
    console.log(`   - POST http://localhost:${PORT}/whatsapp/restart`);
    console.log(`   - GET  http://localhost:${PORT}/health`);
    
    // Auto-start WhatsApp connection
    console.log('🔄 Auto-starting WhatsApp connection...');
    setTimeout(() => {
        initializeWhatsApp();
    }, 2000);
});

// Graceful shutdown handlers
process.on('SIGINT', async () => {
    console.log('🛑 Shutting down service gracefully...');
    try {
        if (client) {
            console.log('Destroying WhatsApp client...');
            await client.destroy();
        }
        console.log('Service stopped successfully');
        process.exit(0);
    } catch (error) {
        console.error('Shutdown error:', error);
        process.exit(1);
    }
});

process.on('SIGTERM', async () => {
    console.log('🛑 Service terminated...');
    try {
        if (client) {
            await client.destroy();
        }
        process.exit(0);
    } catch (error) {
        console.error('Termination error:', error);
        process.exit(1);
    }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    // Don't exit, just log and continue
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    // Don't exit, just log and continue
}); 