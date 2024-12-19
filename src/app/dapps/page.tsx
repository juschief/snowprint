"use client";

import { DappsList } from '@/components/DappsList';

export default function DApps() {
  return (
    <div className="flex flex-col items-center pt-16 pb-8 px-4">
      <h1 className="text-2xl md:text-4xl font-bold mb-12 text-white">
        Dapps on Avalanche
      </h1>
      <DappsList />
    </div>
  );
} 