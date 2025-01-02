"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface BlockchainData {
  blocks: Array<{
    number: string;
    timestamp: number;
    transactions: number;
    hash: string;
  }>;
  transactions: Array<{
    hash: string;
    from: string;
    to: string;
    value: string;
    timestamp: number;
  }>;
  crossChain: Array<{
    sourceChain: string;
    destinationChain: string;
    hash: string;
    timestamp: number;
  }>;
}

export function BlockchainStats() {
  const [data, setData] = useState<BlockchainData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlockchainData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [blocksRes, txRes, crossChainRes] = await Promise.all([
          api.getLatestBlock(),
          api.getTransactions(),
          api.getCrossChainTxs()
        ]);

        setData({
          blocks: blocksRes.data,
          transactions: txRes.data,
          crossChain: crossChainRes.data
        });
      } catch (err) {
        console.error('Failed to fetch blockchain data:', err);
        setError('Failed to fetch blockchain data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlockchainData();
    const interval = setInterval(fetchBlockchainData, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-zinc-800/50 rounded-xl p-6 animate-pulse">
            <div className="h-6 bg-zinc-700/50 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-zinc-700/50 rounded w-full"></div>
              <div className="h-4 bg-zinc-700/50 rounded w-5/6"></div>
              <div className="h-4 bg-zinc-700/50 rounded w-4/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-zinc-800/50 rounded-xl p-6">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Latest Blocks */}
      <div className="bg-zinc-800/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-blue-500 mb-4">Latest Blocks</h2>
        <div className="space-y-4">
          {data?.blocks.map((block) => (
            <div key={block.hash} className="bg-zinc-700/50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-300">Block #{block.number}</span>
                <span className="text-xs text-gray-400">
                  {new Date(block.timestamp * 1000).toLocaleTimeString()}
                </span>
              </div>
              <div className="mt-2 text-sm">
                <span className="text-gray-400">Txs: </span>
                <span className="text-white">{block.transactions}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Transactions */}
      <div className="bg-zinc-800/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-blue-500 mb-4">Latest Transactions</h2>
        <div className="space-y-4">
          {data?.transactions.map((tx) => (
            <div key={tx.hash} className="bg-zinc-700/50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="truncate flex-1">
                  <div className="text-sm text-gray-300 truncate">
                    From: {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                  </div>
                  <div className="text-sm text-gray-300 truncate">
                    To: {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                  </div>
                </div>
                <span className="text-xs text-gray-400 ml-2">
                  {new Date(tx.timestamp * 1000).toLocaleTimeString()}
                </span>
              </div>
              <div className="mt-2 text-sm">
                <span className="text-gray-400">Value: </span>
                <span className="text-white">{parseFloat(tx.value).toFixed(4)} AVAX</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-Chain Transactions */}
      <div className="bg-zinc-800/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-blue-500 mb-4">Cross-Chain Activity</h2>
        <div className="space-y-4">
          {data?.crossChain.map((tx) => (
            <div key={tx.hash} className="bg-zinc-700/50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-gray-300">
                    From: {tx.sourceChain}
                  </div>
                  <div className="text-sm text-gray-300">
                    To: {tx.destinationChain}
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(tx.timestamp * 1000).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 