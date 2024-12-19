"use client";

import { NetworkStats } from '@/components/NetworkStats';
import { BlockchainStats } from '@/components/BlockchainStats';
import { SnowprintLogo } from '@/components/SnowprintLogo';
import { useState } from 'react';
import { SortableHeader } from '@/components/SortableHeader';
import { DAppCard } from '@/components/DAppCard';

interface DApp {
  name: string;
  category: string;
  tvl: number;
  volume24h: number;
  users24h: number;
  image: string;
}

interface L1Chain {
  name: string;
  tvl: number;
  transactions24h: number;
  avgFee: number;
}

type SortField = 'tvl' | 'volume24h' | 'users24h' | 'transactions24h' | 'avgFee';
type SortDirection = 'asc' | 'desc';

export default function ExplorePage() {
  const [dappSortField, setDappSortField] = useState<SortField>('tvl');
  const [dappSortDirection, setDappSortDirection] = useState<SortDirection>('desc');
  const [chainSortField, setChainSortField] = useState<SortField>('tvl');
  const [chainSortDirection, setChainSortDirection] = useState<SortDirection>('desc');

  const topDApps: DApp[] = [
    {
      name: "Trader Joe",
      category: "DEX",
      tvl: 120000000,
      volume24h: 15000000,
      users24h: 25000,
      image: "/dapps/traderjoe.svg"
    },
    {
      name: "AAVE Avalanche",
      category: "Lending",
      tvl: 180000000,
      volume24h: 12000000,
      users24h: 15000,
      image: "/dapps/aave.svg"
    },
    {
      name: "Pangolin",
      category: "DEX",
      tvl: 95000000,
      volume24h: 8000000,
      users24h: 12000,
      image: "/dapps/pangolin.svg"
    },
    {
      name: "Benqi",
      category: "Lending",
      tvl: 85000000,
      volume24h: 5000000,
      users24h: 8000,
      image: "/dapps/benqi.svg"
    },
    {
      name: "GMX",
      category: "Derivatives",
      tvl: 75000000,
      volume24h: 25000000,
      users24h: 18000,
      image: "/dapps/gmx.svg"
    }
  ];

  const topL1Chains: L1Chain[] = [
    {
      name: "Avalanche C-Chain",
      tvl: 5000000000,
      transactions24h: 850000,
      avgFee: 0.25
    },
    {
      name: "DFK Chain",
      tvl: 1200000000,
      transactions24h: 250000,
      avgFee: 0.15
    },
    {
      name: "Swimmer Network",
      tvl: 800000000,
      transactions24h: 150000,
      avgFee: 0.12
    },
    {
      name: "DEXALOT Subnet",
      tvl: 600000000,
      transactions24h: 120000,
      avgFee: 0.10
    },
    {
      name: "Crabada Chain",
      tvl: 400000000,
      transactions24h: 80000,
      avgFee: 0.08
    }
  ];

  const sortData = (data: any[], field: SortField, direction: SortDirection) => {
    return [...data].sort((a, b) => {
      return direction === 'asc' 
        ? a[field] - b[field]
        : b[field] - a[field];
    });
  };

  const handleSort = (field: SortField, type: 'dapp' | 'chain') => {
    if (type === 'dapp') {
      if (field === dappSortField) {
        setDappSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
      } else {
        setDappSortField(field);
        setDappSortDirection('desc');
      }
    } else {
      if (field === chainSortField) {
        setChainSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
      } else {
        setChainSortField(field);
        setChainSortDirection('desc');
      }
    }
  };

  const sortedDApps = sortData(topDApps, dappSortField, dappSortDirection);
  const sortedChains = sortData(topL1Chains, chainSortField, chainSortDirection);

  const featuredDApps = [
    {
      name: "Trader Joe",
      description: "Leading DEX on Avalanche with spot and perpetual trading",
      image: "/dapps/traderjoe.svg",
      url: "https://traderjoexyz.com",
      category: "DEX"
    },
    {
      name: "AAVE",
      description: "Premier lending protocol with multiple asset pools",
      image: "/dapps/aave.svg",
      url: "https://app.aave.com",
      category: "Lending"
    },
    {
      name: "Benqi",
      description: "Native Avalanche lending and liquid staking protocol",
      image: "/dapps/benqi.svg",
      url: "https://benqi.fi",
      category: "Lending"
    },
    {
      name: "GMX",
      description: "Decentralized perpetual exchange with low fees",
      image: "/dapps/gmx.svg",
      url: "https://gmx.io",
      category: "Derivatives"
    },
    {
      name: "Pangolin",
      description: "Community-driven DEX with innovative tokenomics",
      image: "/dapps/pangolin.svg",
      url: "https://pangolin.exchange",
      category: "DEX"
    },
    {
      name: "Platypus",
      description: "Stablecoin DEX with single-sided liquidity",
      image: "/dapps/platypus.svg",
      url: "https://platypus.finance",
      category: "DEX"
    },
    {
      name: "Yield Yak",
      description: "Auto-compounding yield optimizer",
      image: "/dapps/yieldyak.svg",
      url: "https://yieldyak.com",
      category: "Yield"
    },
    {
      name: "Vector Finance",
      description: "Maximized staking and farming returns",
      image: "/dapps/vector.svg",
      url: "https://vectorfinance.io",
      category: "Yield"
    },
    {
      name: "Dexalot",
      description: "CLOB DEX with order book trading",
      image: "/dapps/dexalot.svg",
      url: "https://dexalot.com",
      category: "DEX"
    },
    {
      name: "Colony",
      description: "Avalanche ecosystem investment platform",
      image: "/dapps/colony.svg",
      url: "https://colony.io",
      category: "Investment"
    },
    {
      name: "Echidna Finance",
      description: "Liquid staking derivatives protocol",
      image: "/dapps/echidna.svg",
      url: "https://echidna.finance",
      category: "Staking"
    },
    {
      name: "Defrost",
      description: "Synthetic assets and derivatives platform",
      image: "/dapps/defrost.svg",
      url: "https://defrost.fi",
      category: "Synthetics"
    }
  ];

  return (
    <div className="flex flex-col items-center justify-start pt-16 min-h-screen gap-8">
      <Header />
      
      <div className="w-full max-w-7xl px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Top DApps Section */}
        <div className="bg-zinc-800/50 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-blue-500 mb-6">Top Dapps</h2>
          
          {/* Headers */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <SortableHeader
              label="TVL"
              field="tvl"
              currentField={dappSortField}
              direction={dappSortDirection}
              onSort={(field) => handleSort(field as SortField, 'dapp')}
            />
            <SortableHeader
              label="24h Volume"
              field="volume24h"
              currentField={dappSortField}
              direction={dappSortDirection}
              onSort={(field) => handleSort(field as SortField, 'dapp')}
            />
            <SortableHeader
              label="24h Users"
              field="users24h"
              currentField={dappSortField}
              direction={dappSortDirection}
              onSort={(field) => handleSort(field as SortField, 'dapp')}
            />
          </div>

          {/* DApps List */}
          <div className="space-y-4">
            {sortedDApps.map((dapp, index) => (
              <div key={dapp.name} className="bg-zinc-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-3">
                    <img
                      src={dapp.image}
                      alt={dapp.name}
                      className="w-8 h-8 rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/dapps/placeholder.svg';
                      }}
                    />
                    <span className="text-lg font-medium text-white">
                      {index + 1}. {dapp.name}
                    </span>
                  </div>
                  <span className="text-sm text-zinc-400">{dapp.category}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-white">${dapp.tvl.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-white">${dapp.volume24h.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-white">{dapp.users24h.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top L1 Chains Section */}
        <div className="bg-zinc-800/50 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-blue-500 mb-6">Top L1 Chains</h2>
          
          {/* Headers */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <SortableHeader
              label="TVL"
              field="tvl"
              currentField={chainSortField}
              direction={chainSortDirection}
              onSort={(field) => handleSort(field as SortField, 'chain')}
            />
            <SortableHeader
              label="24h Transactions"
              field="transactions24h"
              currentField={chainSortField}
              direction={chainSortDirection}
              onSort={(field) => handleSort(field as SortField, 'chain')}
            />
            <SortableHeader
              label="Avg Fee"
              field="avgFee"
              currentField={chainSortField}
              direction={chainSortDirection}
              onSort={(field) => handleSort(field as SortField, 'chain')}
            />
          </div>

          {/* Chains List */}
          <div className="space-y-4">
            {sortedChains.map((chain, index) => (
              <div key={chain.name} className="bg-zinc-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-medium text-white">
                    {index + 1}. {chain.name}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-white">${chain.tvl.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-white">{chain.transactions24h.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-white">${chain.avgFee}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Replace NetworkStats and BlockchainStats with Featured DApps */}
      <div className="w-full max-w-7xl px-4 mt-8">
        <h2 className="text-2xl font-bold text-blue-500 mb-6">Featured Dapps</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredDApps.map((dapp) => (
            <DAppCard
              key={dapp.name}
              name={dapp.name}
              description={dapp.description}
              image={dapp.image}
              url={dapp.url}
              category={dapp.category}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center mb-8 mt-8">
      <h1 className="text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-6 text-blue-500">
        Explore
        <span className="text-zinc-300 inline-block mx-1"></span>
        <span className="inline-block -skew-x-6 text-blue-500"></span>
      </h1>
    </header>
  );
} 