"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BRIDGE_ABI, CHAIN_IDS } from '../config/contracts';

interface Token {
  symbol: string;
  name: string;
  decimals: number;
  address: {
    mainnet: string;
    testnet: string;
  };
  logoUrl?: string;
}

const SUPPORTED_TOKENS: Token[] = [
  {
    symbol: 'AVAX',
    name: 'Avalanche',
    decimals: 18,
    address: {
      mainnet: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
      testnet: '0xd00ae08403B9bbb9124bB305C09058E32C39A48c'
    },
    logoUrl: '/tokens/avax.png'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    address: {
      mainnet: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
      testnet: '0x5425890298aed601595a70AB815c96711a31Bc65'
    },
    logoUrl: '/tokens/usdc.png'
  }
];

const getTokenAddress = (symbol: string, network: 'mainnet' | 'testnet'): string => {
  const token = SUPPORTED_TOKENS.find(t => t.symbol === symbol);
  if (!token) throw new Error(`Token ${symbol} not found`);
  return token.address[network];
};

const getTokenDecimals = (symbol: string): number => {
  const token = SUPPORTED_TOKENS.find(t => t.symbol === symbol);
  if (!token) throw new Error(`Token ${symbol} not found`);
  return token.decimals;
};

interface ValidationErrors {
  [key: string]: string;
}

async function estimateGas(
  sourceChain: string,
  destinationChain: string,
  amount: string,
  provider: ethers.providers.Web3Provider
): Promise<string> {
  // Basic gas estimation
  const gasPrice = await provider.getGasPrice();
  const baseGas = ethers.BigNumber.from('200000'); // Base gas units
  const totalGas = gasPrice.mul(baseGas);
  
  return ethers.utils.formatEther(totalGas);
}

const TEST_TOKENS = {
  AVAX: {
    fuji: '0xd00ae08403B9bbb9124bB305C09058E32C39A48c',
    goerli: '0x...' // Add Goerli WAVAX address
  },
  USDC: {
    fuji: '0x5425890298aed601595a70AB815c96711a31Bc65',
    goerli: '0x...' // Add Goerli USDC address
  }
};

async function validateBridgeTransaction(
  provider: ethers.providers.Web3Provider,
  bridgeContract: ethers.Contract,
  amount: string,
  token: Token,
  network: 'mainnet' | 'testnet',
  destinationChain: string
): Promise<boolean> {
  try {
    // Check if bridge is paused
    const isPaused = await bridgeContract.isPaused();
    if (isPaused) throw new Error('Bridge is currently paused for maintenance');

    // Check amount limits
    const minAmount = await bridgeContract.getMinAmount(token.address[network]);
    const maxAmount = await bridgeContract.getMaxAmount(token.address[network]);
    const amountWei = ethers.utils.parseUnits(amount, token.decimals);
    
    if (amountWei.lt(minAmount)) {
      throw new Error(`Amount below minimum (${ethers.utils.formatUnits(minAmount, token.decimals)} ${token.symbol})`);
    }
    if (amountWei.gt(maxAmount)) {
      throw new Error(`Amount above maximum (${ethers.utils.formatUnits(maxAmount, token.decimals)} ${token.symbol})`);
    }

    // Check if user has sufficient balance
    const tokenContract = new ethers.Contract(
      token.address[network],
      ['function balanceOf(address) view returns (uint256)'],
      provider
    );
    const balance = await tokenContract.balanceOf(await provider.getSigner().getAddress());
    if (balance.lt(amountWei)) {
      throw new Error(`Insufficient ${token.symbol} balance`);
    }

    // Verify destination chain is active
    const chainId = await provider.getNetwork().then(n => n.chainId);
    if (!CHAIN_IDS[network as keyof typeof CHAIN_IDS][destinationChain as 'ethereum' | 'avalanche']) {
      throw new Error('Invalid destination chain');
    }

    return true;
  } catch (error) {
    console.error('Validation error:', error);
    throw error;
  }
}

export function BridgeForm() {
  const [sourceChain, setSourceChain] = useState('ethereum');
  const [destinationChain, setDestinationChain] = useState('avalanche');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<Token>(SUPPORTED_TOKENS[0]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [gasEstimate, setGasEstimate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState('0');
  const network = process.env.NEXT_PUBLIC_NETWORK === 'testnet' ? 'testnet' : 'mainnet';
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'completed' | 'failed'>('idle');
  const [txHash, setTxHash] = useState<string>('');

  const chains = [
    { id: 'ethereum', name: 'Ethereum', chainId: 1 },
    { id: 'avalanche', name: 'Avalanche', chainId: 43114 },
  ];

  useEffect(() => {
    const updateGasEstimate = async () => {
      if (!amount || !selectedToken) return;
      
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const estimate = await estimateGas(sourceChain, destinationChain, amount, provider);
        setGasEstimate(estimate);
      } catch (error) {
        console.error('Error estimating gas:', error);
      }
    };

    updateGasEstimate();
  }, [amount, sourceChain, destinationChain, selectedToken]);

  const handleBridge = async () => {
    if (!selectedToken || !amount) return;

    try {
      setIsLoading(true);
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      
      const network = process.env.NEXT_PUBLIC_NETWORK === 'testnet' ? 'testnet' : 'mainnet';
      const tokenAddress = getTokenAddress(selectedToken.symbol, network);
      const decimals = getTokenDecimals(selectedToken.symbol);

      const tokenContract = new ethers.Contract(
        tokenAddress,
        ['function approve(address spender, uint256 amount) returns (bool)'],
        signer
      );

      const bridgeAddress = network === 'mainnet' 
        ? process.env.NEXT_PUBLIC_BRIDGE_ADDRESS_MAINNET 
        : process.env.NEXT_PUBLIC_BRIDGE_ADDRESS_TESTNET;

      const amountToApprove = ethers.utils.parseUnits(amount, decimals);
      const approveTx = await tokenContract.approve(bridgeAddress, amountToApprove);
      await approveTx.wait();

      const bridgeContract = new ethers.Contract(
        bridgeAddress as string,
        ['function bridge(address token, uint256 amount) payable'],
        signer
      );

      const bridgeTx = await bridgeContract.bridge(
        tokenAddress,
        amountToApprove,
        { value: ethers.utils.parseEther('0.01') }
      );

      await bridgeTx.wait();
      
      alert('Bridge transaction successful!');
    } catch (error: any) {
      console.error('Bridge error:', error);
      alert('Failed to bridge tokens: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkBalance = async () => {
      if (!selectedToken) return;

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();

        const network = process.env.NEXT_PUBLIC_NETWORK === 'testnet' ? 'testnet' : 'mainnet';
        const tokenAddress = getTokenAddress(selectedToken.symbol, network);
        const tokenContract = new ethers.Contract(
          tokenAddress,
          ['function balanceOf(address) view returns (uint256)'],
          provider
        );

        const balance = await tokenContract.balanceOf(address);
        setBalance(ethers.utils.formatUnits(balance, selectedToken.decimals));
      } catch (error) {
        console.error('Error checking balance:', error);
      }
    };

    checkBalance();
  }, [selectedToken]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/tokens/placeholder.svg'; // Fallback image
  };

  const handleTokenSelect = (symbol: string) => {
    const token = SUPPORTED_TOKENS.find(t => t.symbol === symbol);
    if (token) setSelectedToken(token);
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleBridge(); }} className="w-full max-w-lg space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            From Chain
          </label>
          <select
            value={sourceChain}
            onChange={(e) => setSourceChain(e.target.value)}
            className="w-full bg-zinc-800 text-white rounded-lg p-3 border border-zinc-700 focus:ring-2 focus:ring-blue-500"
          >
            {chains.map((chain) => (
              <option key={chain.id} value={chain.id}>
                {chain.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            To Chain
          </label>
          <select
            value={destinationChain}
            onChange={(e) => setDestinationChain(e.target.value)}
            className="w-full bg-zinc-800 text-white rounded-lg p-3 border border-zinc-700 focus:ring-2 focus:ring-blue-500"
          >
            {chains.map((chain) => (
              <option key={chain.id} value={chain.id}>
                {chain.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2">
          Select Token
        </label>
        <div className="relative">
          <select
            value={selectedToken.symbol}
            onChange={(e) => handleTokenSelect(e.target.value)}
            className="w-full bg-zinc-800 text-white rounded-lg p-3 pr-10 border border-zinc-700 focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            {SUPPORTED_TOKENS.map((token) => (
              <option key={token.symbol} value={token.symbol}>
                {token.name} ({token.symbol})
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            <svg 
              className="w-4 h-4 text-zinc-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 9l-7 7-7-7" 
              />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2">
          Amount
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="w-full bg-zinc-800 text-white rounded-lg p-3 border border-zinc-700 focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
            {selectedToken.symbol}
          </span>
        </div>
      </div>

      {gasEstimate && (
        <div className="text-sm text-zinc-400">
          Estimated gas fee: {gasEstimate} ETH
        </div>
      )}

      {selectedToken && (
        <div className="text-sm text-zinc-400">
          Balance: {balance} {selectedToken.symbol}
        </div>
      )}

      {errors.submit && (
        <div className="text-red-500 text-sm">{errors.submit}</div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 text-white rounded-lg p-4 font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'Bridge Tokens'}
      </button>
    </form>
  );
} 