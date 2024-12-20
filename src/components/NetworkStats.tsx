"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { NetworkStats as NetworkStatsType } from '@/types/api';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';

export function NetworkStats() {
  const [stats, setStats] = useState<NetworkStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.getNetworkStats();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch network stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!stats) return null;

  return (
    <div className="w-full p-2.5 bg-zinc-800 rounded-lg">
      <h2 className="text-xs font-semibold mb-2">Network Activity (Previous Day)</h2>
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 bg-zinc-700/50 rounded-lg">
          <p className="text-zinc-400 text-[10px]">Active Addresses</p>
          <p className="text-sm font-medium">
            {Number(stats.activeAddresses).toLocaleString()}
          </p>
        </div>
        <div className="p-2 bg-zinc-700/50 rounded-lg">
          <p className="text-zinc-400 text-[10px]">Total Transactions</p>
          <p className="text-sm font-medium">
            {Number(stats.totalTransactions24h).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
} 