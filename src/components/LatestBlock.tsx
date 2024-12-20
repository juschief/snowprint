"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Block {
  number: number;
  hash: string;
  timestamp: number;
  transactions: string[];
}

export function LatestBlock() {
  const [block, setBlock] = useState<Block | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlock = async () => {
      try {
        const { data } = await api.getLatestBlock();
        setBlock(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlock();
    const interval = setInterval(fetchBlock, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatAddress = (address: string) => 
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  if (loading) {
    return <div className="w-full p-4 bg-zinc-800 rounded-lg animate-pulse">
      <div className="h-4 bg-zinc-700 rounded w-1/4 mb-3"></div>
      <div className="space-y-2">
        <div className="h-3 bg-zinc-700 rounded w-full"></div>
        <div className="h-3 bg-zinc-700 rounded w-3/4"></div>
      </div>
    </div>;
  }

  return (
    <div className="w-full p-2.5 bg-zinc-800 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xs font-semibold">Latest Block</h2>
        <a 
          href={`https://snowtrace.io/block/${block?.number}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 text-xs"
        >
          #{block?.number}
        </a>
      </div>
      <div className="text-[10px] flex items-center text-zinc-400">
        <span>Hash:</span>
        <a 
          href={`https://snowtrace.io/block/${block?.hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 font-mono ml-1"
        >
          {formatAddress(block?.hash || '')}
        </a>
      </div>
    </div>
  );
} 