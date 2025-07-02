const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let client = null;
let qrCodeData = null;
let isReady = false;
let connectionStatus = 'disconnected';

// إنشاء عميل الواتساب
function createWhatsAppClient() {
    client = new Client({
        authStrategy: new LocalAuth({
            dataPath: path.join(__dirname, '.wwebjs_auth')
        }),
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-gpu'
            ],
            timeout: 60000
        }
    });

    // معالج QR Code
    client.on('qr', async (qr) => {
        console.log('🔄 QR Code received, generating image...');
        try {
            // تحويل QR Code إلى صورة base64
            qrCodeData = await QRCode.toDataURL(qr, {
                width: 256,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });
            connectionStatus = 'qr_ready';
            
            // عرض QR Code في Terminal أيضاً
            const QRTerminal = require('qrcode-terminal');
            QRTerminal.generate(qr, { small: true });
            console.log('📱 امسح QR Code أعلاه بالواتساب في هاتفك');
            
        } catch (error) {
            console.error('❌ خطأ في توليد QR Code:', error);
        }
    });

    // معالج الجاهزية
    client.on('ready', () => {
        console.log('✅ تم الاتصال بالواتساب بنجاح!');
        isReady = true;
        connectionStatus = 'ready';
        qrCodeData = null; // إخفاء QR Code عند النجاح
    });

    // معالج المصادقة
    client.on('authenticated', () => {
        console.log('🔐 تم التحقق من الهوية');
        connectionStatus = 'authenticated';
    });

    // معالج فشل المصادقة
    client.on('auth_failure', () => {
        console.log('❌ فشل في المصادقة');
        connectionStatus = 'auth_failed';
        qrCodeData = null;
    });

    // معالج قطع الاتصال
    client.on('disconnected', (reason) => {
        console.log('🔌 تم قطع الاتصال:', reason);
        isReady = false;
        connectionStatus = 'disconnected';
        qrCodeData = null;
    });

    // معالج استقبال الرسائل (للاختبار)
    client.on('message', async (message) => {
        if (message.body === 'ping') {
            message.reply('🏓 Pong! Ta7wila WhatsApp is working!');
        }
    });

    return client;
}

// بدء تشغيل الواتساب
async function initializeWhatsApp() {
    try {
        console.log('🚀 بدء تشغيل خدمة الواتساب...');
        connectionStatus = 'initializing';
        
        if (!client) {
            client = createWhatsAppClient();
        }
        
        // Set timeout for initialization
        const initTimeout = setTimeout(() => {
            console.log('⏰ انتهت مهلة التهيئة - إعادة المحاولة...');
            restartWhatsApp();
        }, 120000); // 2 minutes
        
        // Clear timeout when ready
        client.once('ready', () => {
            clearTimeout(initTimeout);
        });
        
        client.once('qr', () => {
            clearTimeout(initTimeout);
            console.log('✅ QR Code جاهز!');
        });
        
        await client.initialize();
        console.log('⏳ انتظار QR Code...');
        
    } catch (error) {
        console.error('❌ خطأ في تشغيل الواتساب:', error);
        connectionStatus = 'error';
        // Auto-restart on error
        setTimeout(() => {
            console.log('🔄 إعادة تشغيل تلقائي...');
            restartWhatsApp();
        }, 5000);
    }
}

// إعادة تشغيل الواتساب
async function restartWhatsApp() {
    try {
        console.log('🔄 إعادة تشغيل خدمة الواتساب...');
        
        if (client) {
            try {
                if (client.pupBrowser) {
                    await client.destroy();
                } else {
                    console.log('📝 إنهاء العميل بدون browser...');
                }
            } catch (destroyError) {
                console.log('⚠️ تخطي خطأ destroy:', destroyError.message);
            }
            client = null;
        }
        
        isReady = false;
        qrCodeData = null;
        connectionStatus = 'restarting';
        
        console.log('⏳ انتظار 3 ثوانٍ قبل إعادة التشغيل...');
        
        // Wait a bit before restart
        setTimeout(() => {
            console.log('🆕 بدء خدمة جديدة...');
            initializeWhatsApp();
        }, 3000);
        
    } catch (error) {
        console.error('❌ خطأ في إعادة التشغيل:', error);
        connectionStatus = 'error';
        
        // Try simple restart
        setTimeout(() => {
            console.log('🔁 محاولة إعادة تشغيل بسيطة...');
            client = null;
            isReady = false;
            qrCodeData = null;
            initializeWhatsApp();
        }, 5000);
    }
}

// APIs
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
            status: 'available',
            message: 'امسح هذا الكود بالواتساب في هاتفك'
        });
    } else {
        res.json({ 
            qr: null, 
            status: connectionStatus,
            message: connectionStatus === 'ready' ? 
                'الواتساب متصل بالفعل' : 
                'QR Code غير متوفر حالياً'
        });
    }
});

app.post('/whatsapp/send', async (req, res) => {
    try {
        if (!isReady) {
            return res.status(400).json({ 
                success: false, 
                error: 'الواتساب غير متصل',
                status: connectionStatus
            });
        }

        const { number, message } = req.body;
        
        if (!number || !message) {
            return res.status(400).json({ 
                success: false, 
                error: 'الرقم والرسالة مطلوبان' 
            });
        }

        // تنسيق الرقم
        const formattedNumber = number.includes('@c.us') ? number : `${number}@c.us`;
        
        await client.sendMessage(formattedNumber, message);
        
        res.json({ 
            success: true, 
            message: 'تم إرسال الرسالة بنجاح',
            to: number,
            timestamp: new Date().toISOString()
        });
        
        console.log(`📤 تم إرسال رسالة إلى ${number}: ${message}`);
        
    } catch (error) {
        console.error('❌ خطأ في إرسال الرسالة:', error);
        res.status(500).json({ 
            success: false, 
            error: 'فشل في إرسال الرسالة',
            details: error.message
        });
    }
});

app.post('/whatsapp/restart', async (req, res) => {
    try {
        res.json({ 
            success: true, 
            message: 'جاري إعادة تشغيل خدمة الواتساب...',
            timestamp: new Date().toISOString()
        });
        
        // Restart after sending response
        setTimeout(() => {
            restartWhatsApp();
        }, 1000);
        
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'فشل في إعادة التشغيل',
            details: error.message
        });
    }
});

app.post('/whatsapp/connect', async (req, res) => {
    try {
        if (isReady) {
            return res.json({ 
                success: true, 
                message: 'الواتساب متصل بالفعل',
                status: connectionStatus
            });
        }
        
        await initializeWhatsApp();
        
        res.json({ 
            success: true, 
            message: 'بدء عملية الاتصال بالواتساب',
            status: connectionStatus
        });
        
    } catch (error) {
        console.error('❌ خطأ في الاتصال:', error);
        res.status(500).json({ 
            success: false, 
            error: 'فشل في الاتصال',
            details: error.message
        });
    }
});

app.post('/whatsapp/disconnect', async (req, res) => {
    try {
        if (client) {
            await client.destroy();
            client = null;
        }
        
        isReady = false;
        connectionStatus = 'disconnected';
        qrCodeData = null;
        
        res.json({ 
            success: true, 
            message: 'تم قطع الاتصال بنجاح',
            status: connectionStatus
        });
        
        console.log('🔌 تم قطع الاتصال يدوياً');
        
    } catch (error) {
        console.error('❌ خطأ في قطع الاتصال:', error);
        res.status(500).json({ 
            success: false, 
            error: 'فشل في قطع الاتصال',
            details: error.message
        });
    }
});

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.json({
        service: 'Ta7wila WhatsApp Service',
        version: '1.0.0',
        status: connectionStatus,
        endpoints: {
            'GET /whatsapp/status': 'حالة الاتصال',
            'GET /whatsapp/qr': 'الحصول على QR Code',
            'POST /whatsapp/connect': 'بدء الاتصال',
            'POST /whatsapp/send': 'إرسال رسالة',
            'POST /whatsapp/disconnect': 'قطع الاتصال'
        }
    });
});

// بدء الخادم
app.listen(PORT, () => {
    console.log(`🌐 خدمة الواتساب تعمل على http://localhost:${PORT}`);
    console.log('📋 APIs متاحة:');
    console.log(`   - GET  http://localhost:${PORT}/whatsapp/status`);
    console.log(`   - GET  http://localhost:${PORT}/whatsapp/qr`);
    console.log(`   - POST http://localhost:${PORT}/whatsapp/send`);
    console.log(`   - POST http://localhost:${PORT}/whatsapp/connect`);
    console.log(`   - POST http://localhost:${PORT}/whatsapp/disconnect`);
    
    // بدء الاتصال تلقائياً
    setTimeout(() => {
        console.log('\n🔄 بدء الاتصال التلقائي بالواتساب...');
        initializeWhatsApp();
    }, 2000);
});

// معالجة إغلاق البرنامج
process.on('SIGINT', async () => {
    console.log('\n🛑 إيقاف الخدمة...');
    if (client) {
        await client.destroy();
    }
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 إنهاء الخدمة...');
    if (client) {
        await client.destroy();
    }
    process.exit(0);
}); 