export const NETWORKS = {
  AVALANCHE: {
    name: 'Avalanche',
    rpc: process.env.NEXT_PUBLIC_AVALANCHE_RPC || 'https://api.avax.network/ext/bc/C/rpc',
    explorer: 'https://snowtrace.io'
  }
} as const;

export const getNetwork = () => {
  return NETWORKS[process.env.NEXT_PUBLIC_NETWORK as keyof typeof NETWORKS] || NETWORKS.AVALANCHE;
}; 