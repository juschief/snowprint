export const BRIDGE_ABI = [
  'function bridge(address token, uint256 amount) payable',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function isPaused() view returns (bool)',
  'function getMinAmount(address token) view returns (uint256)',
  'function getMaxAmount(address token) view returns (uint256)',
  'function getTransactionStatus(bytes32 txHash) view returns (uint8)',
  'function getValidators() view returns (address[])',
  'event BridgeInitiated(address indexed token, address indexed from, uint256 amount, bytes32 txHash)',
  'event BridgeCompleted(address indexed token, address indexed to, uint256 amount, bytes32 txHash)',
  'event BridgeFailed(bytes32 indexed txHash, string reason)',
  'event ValidatorAdded(address indexed validator)',
  'event ValidatorRemoved(address indexed validator)',
  'event BridgePaused(address indexed operator)',
  'event BridgeUnpaused(address indexed operator)'
];

export const BRIDGE_ADDRESSES = {
  mainnet: {
    ethereum: '0x...',
    avalanche: '0x...'
  },
  testnet: {
    ethereum: '0x50006BDf00000000000000000000000000000000', // Goerli
    avalanche: '0x50006BDf00000000000000000000000000000000'  // Fuji
  }
};

export const CHAIN_IDS = {
  mainnet: {
    ethereum: 1,
    avalanche: 43114
  },
  testnet: {
    ethereum: 5,     // Goerli
    avalanche: 43113 // Fuji
  }
}; 