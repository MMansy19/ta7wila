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

console.log('🚀 Minimal WhatsApp Service Starting...');

// Create minimal WhatsApp client
function createClient() {
    client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });

    client.on('qr', async (qr) => {
        console.log('📱 QR Code received!');
        try {
            qrCodeData = await QRCode.toDataURL(qr);
            connectionStatus = 'qr_ready';
            console.log('✅ QR Code ready for scanning');
            
            // Display QR in terminal
            const QRTerminal = require('qrcode-terminal');
            QRTerminal.generate(qr, { small: true });
            
        } catch (error) {
            console.error('❌ QR Generation Error:', error);
        }
    });

    client.on('ready', () => {
        console.log('✅ WhatsApp Connected!');
        isReady = true;
        connectionStatus = 'ready';
        qrCodeData = null;
    });

    client.on('authenticated', () => {
        console.log('🔐 Authenticated');
        connectionStatus = 'authenticated';
    });

    client.on('auth_failure', () => {
        console.log('❌ Auth Failed');
        connectionStatus = 'auth_failed';
        qrCodeData = null;
    });

    client.on('disconnected', (reason) => {
        console.log('🔌 Disconnected:', reason);
        isReady = false;
        connectionStatus = 'disconnected';
        qrCodeData = null;
    });

    return client;
}

// Start WhatsApp
async function startWhatsApp() {
    try {
        console.log('🔄 Initializing WhatsApp...');
        connectionStatus = 'initializing';
        
        client = createClient();
        await client.initialize();
        
    } catch (error) {
        console.error('❌ Initialization Error:', error);
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
            qr: qrCodeData, 
            status: 'available'
        });
    } else {
        res.json({ 
            qr: null, 
            status: connectionStatus
        });
    }
});

app.post('/whatsapp/send', async (req, res) => {
    try {
        if (!isReady) {
            return res.status(400).json({ 
                success: false, 
                error: 'WhatsApp not connected'
            });
        }

        const { number, message } = req.body;
        const formattedNumber = number.includes('@c.us') ? number : `${number}@c.us`;
        
        await client.sendMessage(formattedNumber, message);
        
        res.json({ 
            success: true, 
            message: 'Message sent successfully'
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🌐 Minimal WhatsApp Service running on http://localhost:${PORT}`);
    console.log('📋 Available endpoints:');
    console.log(`   - GET  http://localhost:${PORT}/whatsapp/status`);
    console.log(`   - GET  http://localhost:${PORT}/whatsapp/qr`);
    console.log(`   - POST http://localhost:${PORT}/whatsapp/send`);
    
    // Auto-start WhatsApp
    setTimeout(() => {
        startWhatsApp();
    }, 1000);
}); 