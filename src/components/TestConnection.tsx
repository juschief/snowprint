"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export function TestConnection() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');

  useEffect(() => {
    const testConnection = async () => {
      try {
        await api.testConnection();
        setStatus('connected');
      } catch (err) {
        console.error('Connection error:', err);
        setStatus('error');
      }
    };

    testConnection();
  }, []);

  if (status === 'loading') return null;

  return (
    <div className="fixed bottom-4 right-4">
      <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5
        ${status === 'connected' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${status === 'connected' ? 'bg-green-400' : 'bg-red-400'}`} />
        {status === 'connected' ? 'Connected' : 'Connection Error'}
      </div>
    </div>
  );
} 