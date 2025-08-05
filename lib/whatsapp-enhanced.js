const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.WHATSAPP_PORT || process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let client = null;
let qrCodeData = null;
let isReady = false;
let connectionStatus = 'disconnected';
let messageHistory = [];
let initializationAttempts = 0;
const MAX_INITIALIZATION_ATTEMPTS = 5;
let lastError = null;

console.log('🔧 Enhanced WhatsApp Service Starting...');

// Enhanced Chrome detection function
function findChromeExecutable() {
    const possiblePaths = [
        // Linux
        '/usr/bin/google-chrome',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium',
        '/snap/bin/chromium',
        '/opt/google/chrome/chrome',
        
        // macOS
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Chromium.app/Contents/MacOS/Chromium',
        
        // Windows (if needed)
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    ];
    
    for (const chromePath of possiblePaths) {
        try {
            if (fs.existsSync(chromePath)) {
                console.log(`✅ Found Chrome at: ${chromePath}`);
                return chromePath;
            }
        } catch (error) {
            // Continue searching
        }
    }
    
    console.log('⚠️  No Chrome found in standard locations, using default');
    return undefined;
}

// Enhanced client creation with multiple fallback strategies
function createClient() {
    const chromeExecutable = findChromeExecutable();
    
    // Base Puppeteer arguments - start minimal and add more if needed
    const baseArgs = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security'
    ];
    
    // Additional args for problematic environments
    const additionalArgs = [
        '--disable-extensions',
        '--no-first-run',
        '--disable-default-apps',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-features=TranslateUI,VizDisplayCompositor',
        '--disable-ipc-flooding-protection',
        '--disable-accelerated-2d-canvas',
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
        '--memory-pressure-off'
    ];
    
    // Use fewer args on first attempt, more on retries
    const argsToUse = initializationAttempts > 2 ? 
        [...baseArgs, ...additionalArgs, '--single-process', '--no-zygote'] : 
        baseArgs;
    
    const puppeteerConfig = {
        headless: true,
        args: argsToUse,
        timeout: 60000,
        handleSIGINT: false,
        handleSIGTERM: false,
        handleSIGHUP: false
    };
    
    // Add executable path if found
    if (chromeExecutable) {
        puppeteerConfig.executablePath = chromeExecutable;
    }
    
    console.log(`🔧 Creating client (attempt ${initializationAttempts + 1}) with ${argsToUse.length} Chrome flags`);
    
    return new Client({
        authStrategy: new LocalAuth({
            clientId: process.env.WHATSAPP_CLIENT_ID || 'enhanced-whatsapp',
            dataPath: './.wwebjs_auth'
        }),
        puppeteer: puppeteerConfig
    });
}

// Enhanced initialization with multiple retry strategies
async function initializeWhatsApp() {
    if (initializationAttempts >= MAX_INITIALIZATION_ATTEMPTS) {
        console.error('❌ Maximum initialization attempts reached');
        connectionStatus = 'failed';
        lastError = 'Maximum initialization attempts exceeded';
        return false;
    }
    
    initializationAttempts++;
    console.log(`🚀 Initializing WhatsApp... (Attempt ${initializationAttempts}/${MAX_INITIALIZATION_ATTEMPTS})`);
    
    try {
        connectionStatus = 'initializing';
        lastError = null;
        
        // Clean up previous client if exists
        if (client) {
            try {
                console.log('🧹 Cleaning up previous client...');
                await client.destroy();
                client = null;
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait before next attempt
            } catch (e) {
                console.log('⚠️  Previous client cleanup error:', e.message);
            }
        }
        
        // Clear session on multiple failures
        if (initializationAttempts > 3) {
            console.log('🗑️  Clearing session data due to repeated failures...');
            try {
                const authPath = './.wwebjs_auth';
                const cachePath = './.wwebjs_cache';
                if (fs.existsSync(authPath)) {
                    fs.rmSync(authPath, { recursive: true, force: true });
                    console.log('✅ Cleared auth data');
                }
                if (fs.existsSync(cachePath)) {
                    fs.rmSync(cachePath, { recursive: true, force: true });
                    console.log('✅ Cleared cache data');
                }
            } catch (e) {
                console.log('⚠️  Session cleanup error:', e.message);
            }
        }
        
        client = createClient();
        
        // Set up event handlers
        client.on('qr', async (qr) => {
            console.log('📱 QR Code received!');
            try {
                // Store both raw QR and data URL
                qrCodeData = {
                    raw: qr,
                    dataUrl: await QRCode.toDataURL(qr)
                };
                connectionStatus = 'qr_ready';
                
                // Show QR in terminal
                const qrTerminal = require('qrcode-terminal');
                qrTerminal.generate(qr, { small: true });
                console.log('✅ QR ready - scan with your phone now!');
                
                // Auto-expire QR after 45 seconds
                setTimeout(() => {
                    if (connectionStatus === 'qr_ready') {
                        console.log('⏰ QR code expired, generating new one...');
                        qrCodeData = null;
                    }
                }, 45000);
                
            } catch (error) {
                console.error('❌ QR Error:', error.message);
                lastError = error.message;
            }
        });
        
        client.on('ready', () => {
            console.log('✅ WhatsApp Ready!');
            isReady = true;
            connectionStatus = 'ready';
            qrCodeData = null;
            initializationAttempts = 0; // Reset on success
            lastError = null;
        });
        
        client.on('authenticated', () => {
            console.log('✅ Authenticated!');
            connectionStatus = 'authenticated';
            lastError = null;
        });
        
        client.on('auth_failure', (msg) => {
            console.log('❌ Auth failed:', msg);
            connectionStatus = 'auth_failed';
            qrCodeData = null;
            lastError = msg;
            
            // Retry after auth failure
            setTimeout(() => {
                if (initializationAttempts < MAX_INITIALIZATION_ATTEMPTS) {
                    console.log('🔄 Retrying after auth failure...');
                    initializeWhatsApp();
                }
            }, 5000);
        });
        
        client.on('disconnected', (reason) => {
            console.log('❌ Disconnected:', reason);
            isReady = false;
            connectionStatus = 'disconnected';
            qrCodeData = null;
            lastError = reason;
            
            // Auto-reconnect after disconnection (but not logout)
            if (reason !== 'LOGOUT' && initializationAttempts < MAX_INITIALIZATION_ATTEMPTS) {
                const delay = Math.min(5000 * initializationAttempts, 30000); // Progressive delay
                console.log(`🔄 Auto-reconnecting in ${delay/1000} seconds...`);
                setTimeout(() => {
                    if (connectionStatus === 'disconnected') {
                        initializeWhatsApp();
                    }
                }, delay);
            }
        });
        
        // Set initialization timeout with progressive increase
        const timeoutDuration = Math.min(30000 + (initializationAttempts * 15000), 120000);
        const initTimeout = setTimeout(() => {
            console.log(`⏰ Initialization timeout after ${timeoutDuration/1000}s`);
            if (connectionStatus === 'initializing') {
                connectionStatus = 'timeout';
                lastError = 'Initialization timeout';
                
                // Retry with longer timeout
                if (initializationAttempts < MAX_INITIALIZATION_ATTEMPTS) {
                    console.log('🔄 Retrying with longer timeout...');
                    setTimeout(() => initializeWhatsApp(), 3000);
                }
            }
        }, timeoutDuration);
        
        await client.initialize();
        clearTimeout(initTimeout);
        
        return true;
        
    } catch (error) {
        console.error(`❌ Initialization error (Attempt ${initializationAttempts}):`, error.message);
        connectionStatus = 'error';
        lastError = error.message;
        
        // Progressive backoff before retry
        if (initializationAttempts < MAX_INITIALIZATION_ATTEMPTS) {
            const delay = Math.min(3000 * initializationAttempts, 15000);
            console.log(`⏳ Retrying in ${delay/1000} seconds...`);
            setTimeout(() => initializeWhatsApp(), delay);
        } else {
            console.log('❌ All initialization attempts failed');
            connectionStatus = 'failed';
        }
        
        return false;
    }
}

// API Routes
app.get('/whatsapp/status', (req, res) => {
    res.json({
        status: connectionStatus,
        ready: isReady,
        hasQR: !!qrCodeData,
        attempts: initializationAttempts,
        maxAttempts: MAX_INITIALIZATION_ATTEMPTS,
        lastError: lastError,
        timestamp: new Date().toISOString()
    });
});

// QR Code endpoint
app.get('/whatsapp/qr', (req, res) => {
    if (qrCodeData) {
        res.json({
            success: true,
            qr: qrCodeData.raw,
            qrDataUrl: qrCodeData.dataUrl
        });
    } else {
        res.json({
            success: false,
            error: 'No QR code available'
        });
    }
});

app.post('/whatsapp/send', async (req, res) => {
    if (!isReady || !client) {
        return res.status(503).json({ 
            success: false, 
            error: 'WhatsApp not ready',
            status: connectionStatus 
        });
    }
    
    const { phone, message } = req.body;
    
    if (!phone || !message) {
        return res.status(400).json({ 
            success: false, 
            error: 'Phone and message are required' 
        });
    }
    
    try {
        // Format phone number
        const chatId = phone.includes('@') ? phone : `${phone.replace(/[^\d]/g, '')}@c.us`;
        console.log(`📤 Sending message to ${chatId}: ${message}`);
        
        await client.sendMessage(chatId, message);
        
        res.json({ 
            success: true, 
            message: 'Message sent successfully',
            to: chatId
        });
        
    } catch (error) {
        console.error('❌ Send message error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

app.post('/whatsapp/restart', async (req, res) => {
    console.log('🔄 Manual restart requested');
    initializationAttempts = 0; // Reset attempts
    connectionStatus = 'restarting';
    
    try {
        if (client) {
            await client.destroy();
            client = null;
        }
        
        setTimeout(() => initializeWhatsApp(), 1000);
        
        res.json({ 
            success: true, 
            message: 'Restart initiated' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

app.get('/whatsapp/reset', async (req, res) => {
    console.log('🗑️  Reset requested - clearing all data');
    
    try {
        // Stop client
        if (client) {
            await client.destroy();
            client = null;
        }
        
        // Clear session data
        const authPath = './.wwebjs_auth';
        const cachePath = './.wwebjs_cache';
        
        if (fs.existsSync(authPath)) {
            fs.rmSync(authPath, { recursive: true, force: true });
        }
        if (fs.existsSync(cachePath)) {
            fs.rmSync(cachePath, { recursive: true, force: true });
        }
        
        // Reset state
        initializationAttempts = 0;
        connectionStatus = 'disconnected';
        isReady = false;
        qrCodeData = null;
        lastError = null;
        
        res.json({ 
            success: true, 
            message: 'Reset complete - start service again' 
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

app.get('/health', (req, res) => {
    res.json({
        service: 'WhatsApp Enhanced',
        status: 'running',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        whatsapp: {
            status: connectionStatus,
            ready: isReady,
            attempts: initializationAttempts
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🌐 Enhanced WhatsApp Service running on http://localhost:${PORT}`);
    console.log('📋 Available APIs:');
    console.log(`   - GET  http://localhost:${PORT}/whatsapp/status`);
    console.log(`   - GET  http://localhost:${PORT}/whatsapp/qr`);
    console.log(`   - POST http://localhost:${PORT}/whatsapp/send`);
    console.log(`   - POST http://localhost:${PORT}/whatsapp/restart`);
    console.log(`   - GET  http://localhost:${PORT}/whatsapp/reset`);
    console.log(`   - GET  http://localhost:${PORT}/health`);
    console.log('');
    
    // Auto-start WhatsApp initialization
    console.log('🔄 Auto-starting WhatsApp initialization...');
    initializeWhatsApp();
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('🛑 Service shutting down...');
    if (client) {
        try {
            await client.destroy();
        } catch (e) {
            console.log('⚠️  Error during shutdown:', e.message);
        }
    }
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('🛑 Service terminating...');
    if (client) {
        try {
            await client.destroy();
        } catch (e) {
            console.log('⚠️  Error during termination:', e.message);
        }
    }
    process.exit(0);
}); 