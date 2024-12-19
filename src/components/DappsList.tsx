"use client";

import { useState } from 'react';

interface DApp {
  name: string;
  description: string;
  url: string;
  category: string;
  logo: string;
  tvl?: string;
  volume24h?: string;
  apy?: string;
  status: 'live' | 'upcoming' | 'beta';
}

type SortOption = 'tvl' | 'volume' | 'name';

export function DappsList() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('tvl');
  const [searchTerm, setSearchTerm] = useState('');

  const dapps: DApp[] = [
    // DEX Category
    {
      name: "Trader Joe",
      description: "Leading DEX on Avalanche with spot trading, lending, and staking",
      url: "https://traderjoexyz.com",
      category: "DEX",
      logo: "/dapps/traderjoe.svg",
      tvl: "$94.23M",
      volume24h: "$12.5M",
      apy: "Up to 42.3%",
      status: 'live'
    },
    {
      name: "Platypus Finance",
      description: "Stableswap AMM DEX optimized for minimal slippage",
      url: "https://platypus.finance",
      category: "DEX",
      logo: "/dapps/platypus.svg",
      tvl: "$23.1M",
      volume24h: "$5.2M",
      apy: "Up to 12.8%",
      status: 'live'
    },
    {
      name: "Pangolin",
      description: "Community-driven DEX with governance and yield farming",
      url: "https://pangolin.exchange",
      category: "DEX",
      logo: "/dapps/pangolin.svg",
      tvl: "$18.5M",
      volume24h: "$3.1M",
      apy: "Up to 25.6%",
      status: 'live'
    },

    // Lending Category
    {
      name: "AAVE",
      description: "Leading DeFi lending protocol for borrowing and lending assets",
      url: "https://app.aave.com",
      category: "Lending",
      logo: "/dapps/aave.svg",
      tvl: "$237.8M",
      apy: "Up to 3.8%",
      status: 'live'
    },
    {
      name: "Benqi",
      description: "Avalanche native liquidity protocol for lending and borrowing",
      url: "https://benqi.fi",
      category: "Lending",
      logo: "/dapps/benqi.svg",
      tvl: "$48.5M",
      apy: "Up to 4.2%",
      status: 'live'
    },

    // Derivatives
    {
      name: "GMX",
      description: "Decentralized perpetual exchange with low fees",
      url: "https://gmx.io",
      category: "Derivatives",
      logo: "/dapps/gmx.svg",
      tvl: "$521.4M",
      volume24h: "$125.3M",
      status: 'live'
    },
    {
      name: "Hubble Exchange",
      description: "Zero-fee perpetual futures trading platform",
      url: "https://hubble.exchange",
      category: "Derivatives",
      logo: "/dapps/hubble.svg",
      tvl: "$15.2M",
      volume24h: "$8.4M",
      status: 'beta'
    },

    // Yield
    {
      name: "Yield Yak",
      description: "Auto-compounding yield optimizer",
      url: "https://yieldyak.com",
      category: "Yield",
      logo: "/dapps/yieldyak.svg",
      tvl: "$42.1M",
      apy: "Up to 18.2%",
      status: 'live'
    },

    // NFT
    {
      name: "Joepegs",
      description: "NFT marketplace by Trader Joe",
      url: "https://joepegs.com",
      category: "NFT",
      logo: "/dapps/joepegs.svg",
      volume24h: "$234.5K",
      status: 'live'
    },
    {
      name: "Kalao",
      description: "NFT marketplace and metaverse platform",
      url: "https://kalao.io",
      category: "NFT",
      logo: "/dapps/kalao.svg",
      volume24h: "$156.2K",
      status: 'live'
    },

    // Gaming
    {
      name: "Crabada",
      description: "Play-to-earn NFT gaming ecosystem",
      url: "https://crabada.com",
      category: "Gaming",
      logo: "/dapps/crabada.svg",
      tvl: "$8.2M",
      status: 'live'
    }
  ];

  const categories = ['all', ...Array.from(new Set(dapps.map(dapp => dapp.category)))];

  const filteredDapps = dapps
    .filter(dapp => 
      (selectedCategory === 'all' || dapp.category === selectedCategory) &&
      (dapp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       dapp.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'tvl':
          return (parseFloat(b.tvl?.replace(/[^0-9.]/g, '') || '0') - 
                  parseFloat(a.tvl?.replace(/[^0-9.]/g, '') || '0'));
        case 'volume':
          return (parseFloat(b.volume24h?.replace(/[^0-9.]/g, '') || '0') - 
                  parseFloat(a.volume24h?.replace(/[^0-9.]/g, '') || '0'));
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/tokens/placeholder.svg';
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-white hover:bg-zinc-700'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search DApps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-blue-500"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-blue-500"
          >
            <option value="tvl">Sort by TVL</option>
            <option value="volume">Sort by Volume</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDapps.map((dapp) => (
          <a
            key={dapp.name}
            href={dapp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-zinc-900 p-6 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={dapp.logo}
                alt={dapp.name}
                className="w-12 h-12 rounded-full"
                onError={handleImageError}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">{dapp.name}</h2>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    dapp.status === 'live' ? 'bg-green-900 text-green-300' :
                    dapp.status === 'beta' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-blue-900 text-blue-300'
                  }`}>
                    {dapp.status.toUpperCase()}
                  </span>
                </div>
                <span className="text-sm bg-zinc-700 text-white px-3 py-1 rounded-full">
                  {dapp.category}
                </span>
              </div>
            </div>
            
            <p className="text-zinc-400 mb-4">{dapp.description}</p>
            
            <div className="flex flex-wrap gap-4 text-sm">
              {dapp.tvl && (
                <div className="text-zinc-300">
                  <span className="text-zinc-500">TVL:</span> {dapp.tvl}
                </div>
              )}
              {dapp.volume24h && (
                <div className="text-zinc-300">
                  <span className="text-zinc-500">24h Vol:</span> {dapp.volume24h}
                </div>
              )}
              {dapp.apy && (
                <div className="text-zinc-300">
                  <span className="text-zinc-500">APY:</span> {dapp.apy}
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
} 