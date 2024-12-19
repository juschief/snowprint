"use client";

import { client } from "./client";
import { NetworkStats } from '@/components/NetworkStats';
import { BlockchainStats } from '@/components/BlockchainStats';
import { SnowprintLogo } from '@/components/SnowprintLogo';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-start pt-8 min-h-screen gap-8">
      <Header />
      <NetworkStats />
      <BlockchainStats />
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
