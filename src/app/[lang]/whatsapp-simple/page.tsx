'use client';

import { useState, useEffect } from 'react';

export default function WhatsAppSimple() {
  const [qrCode, setQrCode] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-5), `${timestamp}: ${message}`]);
  };

  const testQR = async () => {
    setLoading(true);
    setQrCode('');
    addLog('🚀 Starting QR test...');
    
    try {
      addLog('📡 Fetching QR from API...');
      const response = await fetch('/api/whatsapp?action=qr');
      const data = await response.json();
      
      addLog(`📊 API Response: ${JSON.stringify(data).substring(0, 100)}...`);
      
      if (data.qr) {
        setQrCode(data.qr);
        setStatus('✅ QR Code loaded successfully');
        addLog('✅ QR Code set in state');
      } else {
        setStatus('❌ No QR code in response');
        addLog('❌ No QR in response');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setStatus(`❌ Error: ${errorMsg}`);
      addLog(`❌ Error: ${errorMsg}`);
    }
    setLoading(false);
  };

  const testStatus = async () => {
    try {
      addLog('📊 Checking status...');
      const response = await fetch('/api/whatsapp?action=status');
      const data = await response.json();
      addLog(`Status: ${JSON.stringify(data)}`);
      setStatus(`Status: ${data.status}, hasQR: ${data.hasQR}, isReady: ${data.isReady}`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      addLog(`❌ Status error: ${errorMsg}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">WhatsApp QR Test</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <div className="flex gap-4 mb-4">
            <button
              onClick={testQR}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {loading ? 'Loading QR...' : 'Test QR Code'}
            </button>
            
            <button
              onClick={testStatus}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Check Status
            </button>
          </div>
          
          <div className="mt-4">
            <strong>Status:</strong>
            <div className="bg-gray-700 p-3 rounded mt-2 text-sm">{status || 'No status'}</div>
          </div>
        </div>

        {/* QR Code Display */}
        {qrCode && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">QR Code</h2>
            <div className="bg-white p-4 rounded-lg inline-block">
              <img 
                src={qrCode} 
                alt="WhatsApp QR Code" 
                className="w-64 h-64 mx-auto"
                onLoad={() => addLog('🖼️ QR image loaded successfully')}
                onError={() => addLog('❌ QR image failed to load')}
              />
            </div>
            <p className="text-gray-300 mt-4">امسح هذا الكود بالواتساب في هاتفك</p>
          </div>
        )}

        {/* Debug Logs */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
          <div className="bg-gray-900 p-4 rounded text-sm font-mono max-h-40 overflow-y-auto">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))
            ) : (
              <div className="text-gray-500">No logs yet...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 