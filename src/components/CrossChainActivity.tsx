"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { LoadingState } from './LoadingState';

interface CrossChainTx {
  sourceChain: string;
  destinationChain: string;
  hash: string;
  timestamp: number;
  amount: string;
  token: string;
  status: 'Completed' | 'Pending' | 'Failed';
  type: 'Bridge' | 'Swap' | 'Transfer';
}

export function CrossChainActivity() {
  const [transactions, setTransactions] = useState<CrossChainTx[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await api.getCrossChainTxs();
        setTransactions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
    const interval = setInterval(fetchTransactions, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatAddress = (hash: string) => {
    const truncatedHash = hash ? `${hash.slice(0, 6)}...${hash.slice(-4)}` : 'N/A';
    return truncatedHash;
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
  };

  if (loading) {
    return <div className="w-full p-2.5 bg-zinc-800 rounded-lg animate-pulse">
      <div className="h-4 bg-zinc-700 rounded w-1/4 mb-2"></div>
      <div className="space-y-1">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-10 bg-zinc-700 rounded"></div>
        ))}
      </div>
    </div>;
  }

  return (
    <div className="w-full p-2.5 bg-zinc-800 rounded-lg">
      <h2 className="text-xs font-semibold mb-2">Cross-Chain Activity</h2>
      <div className="space-y-1">
        {transactions.slice(0, 3).map((tx) => (
          <div key={tx.hash} className="p-1.5 bg-zinc-700/50 rounded text-[10px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <span className="text-zinc-400">{tx.type}</span>
                <span className="text-zinc-500">•</span>
                <a 
                  href={`https://layerzeroscan.com/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-mono"
                >
                  {formatAddress(tx.hash)}
                </a>
              </div>
              <span className={`px-1 py-0.5 rounded-sm ${
                tx.status === 'Completed' ? 'bg-green-900/50 text-green-300' : 
                tx.status === 'Pending' ? 'bg-yellow-900/50 text-yellow-300' :
                'bg-red-900/50 text-red-300'
              }`}>
                {tx.status}
              </span>
            </div>
            <div className="flex justify-between items-center mt-0.5 text-zinc-400">
              <div className="flex items-center space-x-1">
                <span>{tx.sourceChain}</span>
                <span>→</span>
                <span>{tx.destinationChain}</span>
              </div>
              <div>
                {tx.amount} {tx.token}
              </div>
            </div>
            <div className="text-zinc-500 mt-0.5 text-right">
              {formatTimestamp(tx.timestamp)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}