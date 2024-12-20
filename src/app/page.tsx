"use client";

import { NetworkStats } from '@/components/NetworkStats';
import { NetworkCharts } from '@/components/NetworkCharts';
import { LatestBlock } from '@/components/LatestBlock';
import { LatestTransactions } from '@/components/LatestTransactions';
import { CrossChainActivity } from '@/components/CrossChainActivity';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-start pt-8 min-h-screen gap-8">
      <Header />
      
      {/* Charts Section */}
      <div className="w-full max-w-7xl px-4">
        <NetworkCharts />
      </div>

      {/* Latest Data Section */}
      <div className="w-full max-w-7xl px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <LatestBlock />
        <LatestTransactions />
      </div>

      {/* Network Stats Section */}
      <div className="w-full max-w-7xl px-4 space-y-4">
        <NetworkStats />
        <CrossChainActivity />
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center mt-16 mb-8">
      <h1 className="text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-6 text-zinc-100">
        Avalanche
        <span className="text-zinc-300 inline-block mx-1"> + </span>
        <span className="inline-block -skew-x-6 text-blue-500">Snowprint</span>
      </h1>
    </header>
  );
}
