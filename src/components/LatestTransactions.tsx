"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Transaction {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  timestamp: number;
  blockNumber: number;
  gasUsed: string;
  status: boolean;
}

export function LatestTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await api.getTransactions();
        setTransactions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
    const interval = setInterval(fetchTransactions, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatAddress = (address: string | null) => 
    address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'N/A';

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
  };

  if (loading) {
    return <div className="w-full p-4 bg-zinc-800 rounded-lg animate-pulse">
      <div className="h-4 bg-zinc-700 rounded w-1/4 mb-3"></div>
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-12 bg-zinc-700 rounded"></div>
        ))}
      </div>
    </div>;
  }

  return (
    <div className="w-full p-2.5 bg-zinc-800 rounded-lg">
      <h2 className="text-xs font-semibold mb-2">Latest Transactions</h2>
      <div className="space-y-1">
        {(transactions || []).slice(0, 3).map((tx) => (
          <div key={tx.hash} className="p-1.5 bg-zinc-700/50 rounded text-[10px]">
            <div className="flex items-center justify-between">
              <a 
                href={`https://snowtrace.io/tx/${tx.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-mono"
              >
                {formatAddress(tx.hash)}
              </a>
              <span className={`px-1 py-0.5 rounded-sm ${
                tx.status ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
              }`}>
                {tx.status ? 'Success' : 'Failed'}
              </span>
            </div>
            <div className="text-zinc-400 mt-0.5 flex justify-between">
              <span>{Number(tx.value).toFixed(2)} AVAX</span>
              <span>{formatTimestamp(tx.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 