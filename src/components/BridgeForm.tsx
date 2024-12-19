"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { SUPPORTED_TOKENS, getTokenAddress, getTokenDecimals } from '../config/tokens';

interface ValidationErrors {
  [key: string]: string;
}

export function BridgeForm() {
  const [sourceChain, setSourceChain] = useState('ethereum');
  const [destinationChain, setDestinationChain] = useState('avalanche');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState(SUPPORTED_TOKENS[0]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [gasEstimate, setGasEstimate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState('0');

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
      
      const network = process.env.NEXT_PUBLIC_NETWORK as 'mainnet' | 'testnet';
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

        const tokenContract = new ethers.Contract(
          selectedToken.address,
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
            onChange={(e) => {
              const token = SUPPORTED_TOKENS.find(t => t.symbol === e.target.value);
              if (token) setSelectedToken(token);
            }}
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