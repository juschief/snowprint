"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface Token {
  symbol: string;
  name: string;
  logo: string;
  address: string;
  decimals: number;
}

export function BridgeForm() {
  const [sourceChain, setSourceChain] = useState('ethereum');
  const [destinationChain, setDestinationChain] = useState('avalanche');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [gasEstimate, setGasEstimate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState('0');

  const chains = [
    { id: 'ethereum', name: 'Ethereum', chainId: 1 },
    { id: 'avalanche', name: 'Avalanche', chainId: 43114 },
  ];

  const tokens: Token[] = [
    { 
      symbol: 'WETH', 
      name: 'Wrapped Ether', 
      logo: '/tokens/eth.svg',
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      decimals: 18
    },
    { 
      symbol: 'USDC', 
      name: 'USD Coin', 
      logo: '/tokens/usdc.svg',
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      decimals: 6
    },
    { 
      symbol: 'USDT', 
      name: 'Tether', 
      logo: '/tokens/usdt.svg',
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      decimals: 6
    },
    { 
      symbol: 'DAI', 
      name: 'Dai Stablecoin', 
      logo: '/tokens/dai.svg',
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      decimals: 18
    }
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

      const tokenContract = new ethers.Contract(
        selectedToken.address,
        ['function approve(address spender, uint256 amount) returns (bool)'],
        signer
      );

      const bridgeAddress = '0x50Ff3B278fCC70ec7A9465063d68029AB460eA04';
      const amountToApprove = ethers.utils.parseUnits(amount, selectedToken.decimals);
      const approveTx = await tokenContract.approve(bridgeAddress, amountToApprove);
      await approveTx.wait();

      const bridgeContract = new ethers.Contract(
        bridgeAddress,
        ['function bridge(address token, uint256 amount) payable'],
        signer
      );

      const bridgeTx = await bridgeContract.bridge(
        selectedToken.address,
        amountToApprove,
        { value: ethers.utils.parseEther('0.01') }
      );

      await bridgeTx.wait();
      
      alert('Bridge transaction successful!');
    } catch (error) {
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

  const getTokenAddress = (token: string, chain: string) => {
    const addresses = {
      ethereum: {
        WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F'
      },
      avalanche: {
        WETH: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
        USDC: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
        USDT: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
        DAI: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70'
      }
    };
    return addresses[chain as keyof typeof addresses][token as keyof typeof addresses.ethereum];
  };

  const handleTokenSelect = (token: Token) => {
    const address = getTokenAddress(token.symbol, sourceChain);
    setSelectedToken({
      ...token,
      address
    });
  };

  useEffect(() => {
    if (selectedToken) {
      const newAddress = getTokenAddress(selectedToken.symbol, sourceChain);
      setSelectedToken(prev => prev ? { ...prev, address: newAddress } : null);
    }
  }, [sourceChain]);

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
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {tokens.map((token) => (
            <button
              key={token.symbol}
              type="button"
              onClick={() => handleTokenSelect(token)}
              className={`flex items-center space-x-2 p-3 rounded-lg border ${
                selectedToken?.symbol === token.symbol
                  ? 'border-blue-500 bg-zinc-800'
                  : 'border-zinc-700 hover:bg-zinc-800'
              }`}
            >
              <img
                src={token.logo}
                alt={token.name}
                className="w-6 h-6 rounded-full"
                onError={handleImageError}
              />
              <span className="text-white">{token.symbol}</span>
            </button>
          ))}
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
          {selectedToken && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
              {selectedToken.symbol}
            </span>
          )}
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