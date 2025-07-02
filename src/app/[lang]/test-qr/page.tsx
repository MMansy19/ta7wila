'use client';

import { useState, useEffect } from 'react';

export default function TestQR() {
  const [qrCode, setQrCode] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const testQR = async () => {
    setLoading(true);
    try {
      console.log('Testing QR...');
      
      // Get QR directly
      const qrResponse = await fetch('/api/whatsapp?action=qr');
      const qrData = await qrResponse.json();
      
      console.log('QR Response:', qrData);
      
      if (qrData.qr) {
        setQrCode(qrData.qr);
        setStatus('✅ QR Code loaded successfully');
      } else {
        setStatus('❌ No QR code in response');
      }
    } catch (error) {
      console.error('QR Test Error:', error);
      setStatus('❌ Error loading QR');
    }
    setLoading(false);
  };

  const testStatus = async () => {
    try {
      const statusResponse = await fetch('/api/whatsapp?action=status');
      const statusData = await statusResponse.json();
      console.log('Status:', statusData);
      setStatus(JSON.stringify(statusData, null, 2));
    } catch (error) {
      console.error('Status Error:', error);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">QR Code Test</h1>
      
      <div className="space-y-4">
        <button
          onClick={testQR}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Test QR Code'}
        </button>
        
        <button
          onClick={testStatus}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
        >
          Test Status
        </button>
        
        <div className="mt-4">
          <strong>Status:</strong>
          <pre className="text-sm mt-2 p-2 bg-gray-100 rounded">{status}</pre>
        </div>
        
        {qrCode && (
          <div className="mt-4">
            <strong>QR Code:</strong>
            <div className="mt-2 border p-4 rounded">
              <img 
                src={qrCode} 
                alt="QR Code" 
                className="max-w-full h-auto"
                onError={() => setStatus('❌ Error displaying QR image')}
                onLoad={() => setStatus('✅ QR Code image loaded successfully')}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 