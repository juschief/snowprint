"use client";

import { useEffect, useState } from 'react';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
}

interface Block {
  number: string;
  timestamp: number;
  transactions: number;
  hash: string;
}

interface CrossChainTx {
  sourceChain: string;
  destinationChain: string;
  hash: string;
  timestamp: number;
}

export function BlockchainStats() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [crossChainTxs, setCrossChainTxs] = useState<CrossChainTx[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to truncate addresses/hashes
  const truncate = (str: string) => `${str.slice(0, 6)}...${str.slice(-4)}`;
  
  // Helper function to format timestamp
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // For demonstration, using simulated data
        // In production, replace with actual API calls to Avalanche nodes
        
        // Simulate blocks
        const mockBlocks: Block[] = Array.from({ length: 5 }, (_, i) => ({
          number: String(16000000 - i),
          timestamp: Math.floor(Date.now() / 1000) - i * 60,
          transactions: Math.floor(Math.random() * 100),
          hash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`
        }));
        
        // Simulate transactions
        const mockTxs: Transaction[] = Array.from({ length: 5 }, () => ({
          hash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
          from: `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
          to: `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
          value: (Math.random() * 10).toFixed(4),
          timestamp: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 3600)
        }));

        // Simulate cross-chain transactions
        const mockCrossChainTxs: CrossChainTx[] = Array.from({ length: 5 }, () => ({
          sourceChain: Math.random() > 0.5 ? 'Ethereum' : 'BSC',
          destinationChain: 'Avalanche',
          hash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
          timestamp: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 3600)
        }));

        setBlocks(mockBlocks);
        setTransactions(mockTxs);
        setCrossChainTxs(mockCrossChainTxs);
      } catch (error) {
        console.error('Error fetching blockchain data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // Set up polling every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <div className="text-white text-center">Loading blockchain data...</div>;
  }

  const StatCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-zinc-900 p-6 rounded-lg hover:bg-zinc-800 transition-colors">
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      {children}
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-3 w-full">
      <StatCard title="Latest Blocks">
        <div className="space-y-3">
          {blocks.map((block) => (
            <div key={block.hash} className="text-sm">
              <div className="flex justify-between text-zinc-400">
                <span>Block {block.number}</span>
                <span>{formatTime(block.timestamp)}</span>
              </div>
              <div className="text-white">
                Txs: {block.transactions} | Hash: {truncate(block.hash)}
              </div>
            </div>
          ))}
        </div>
      </StatCard>

      <StatCard title="Latest Transactions">
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.hash} className="text-sm">
              <div className="text-zinc-400">Hash: {truncate(tx.hash)}</div>
              <div className="text-white">
                From: {truncate(tx.from)} → To: {truncate(tx.to)}
              </div>
              <div className="text-zinc-400">Value: {tx.value} AVAX</div>
            </div>
          ))}
        </div>
      </StatCard>

      <StatCard title="Cross-Chain Transactions">
        <div className="space-y-3">
          {crossChainTxs.map((tx) => (
            <div key={tx.hash} className="text-sm">
              <div className="text-zinc-400">
                {tx.sourceChain} → {tx.destinationChain}
              </div>
              <div className="text-white">Hash: {truncate(tx.hash)}</div>
              <div className="text-zinc-400">{formatTime(tx.timestamp)}</div>
            </div>
          ))}
        </div>
      </StatCard>
    </div>
  );
} 