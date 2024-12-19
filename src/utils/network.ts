import { ethers } from 'ethers';

export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  bridgeAddress: string;
}

export const NETWORKS: { [key: string]: NetworkConfig } = {
  ethereum: {
    chainId: 1,
    name: 'Ethereum',
    rpcUrl: 'https://mainnet.infura.io/v3/your-key',
    bridgeAddress: '0x...',
  },
  avalanche: {
    chainId: 43114,
    name: 'Avalanche',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    bridgeAddress: '0x...',
  },
  // Add other networks
};

export const validateNetwork = async (
  sourceChain: string,
  destChain: string,
  provider: ethers.providers.Web3Provider
) => {
  const network = await provider.getNetwork();
  const sourceConfig = NETWORKS[sourceChain];

  if (!sourceConfig) {
    throw new Error('Unsupported source network');
  }

  if (network.chainId !== sourceConfig.chainId) {
    throw new Error(`Please switch to ${sourceConfig.name}`);
  }

  // Check if bridge contracts exist
  const bridgeContract = new ethers.Contract(
    sourceConfig.bridgeAddress,
    ['function isSupported(uint256) view returns (bool)'],
    provider
  );

  const isSupported = await bridgeContract.isSupported(NETWORKS[destChain].chainId);
  if (!isSupported) {
    throw new Error('Bridge not available for this network pair');
  }
};

export const estimateGas = async (
  sourceChain: string,
  destChain: string,
  amount: string,
  provider: ethers.providers.Web3Provider
): Promise<string> => {
  const sourceConfig = NETWORKS[sourceChain];
  const bridgeContract = new ethers.Contract(
    sourceConfig.bridgeAddress,
    ['function estimateFee(uint256, uint256) view returns (uint256)'],
    provider
  );

  const fee = await bridgeContract.estimateFee(
    NETWORKS[destChain].chainId,
    ethers.utils.parseEther(amount)
  );

  return ethers.utils.formatEther(fee);
}; 