export const NETWORKS = {
  testnet: {
    name: 'Avalanche Fuji',
    chainId: 43113,
    rpcUrl: process.env.NEXT_PUBLIC_AVALANCHE_RPC_TESTNET,
    explorer: process.env.NEXT_PUBLIC_EXPLORER_TESTNET,
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18
    },
    contracts: {
      bridge: process.env.NEXT_PUBLIC_BRIDGE_ADDRESS_TESTNET
    }
  },
  mainnet: {
    name: 'Avalanche',
    chainId: 43114,
    rpcUrl: process.env.NEXT_PUBLIC_AVALANCHE_RPC_MAINNET,
    explorer: process.env.NEXT_PUBLIC_EXPLORER_MAINNET,
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18
    },
    contracts: {
      bridge: process.env.NEXT_PUBLIC_BRIDGE_ADDRESS_MAINNET
    }
  }
};

export const getNetwork = () => {
  return NETWORKS[process.env.NEXT_PUBLIC_NETWORK as keyof typeof NETWORKS] || NETWORKS.testnet;
}; 