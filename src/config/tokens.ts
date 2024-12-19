export interface Token {
  symbol: string;
  name: string;
  decimals: number;
  address: {
    mainnet: string;
    testnet: string;
  };
  logo?: string;
}

export const SUPPORTED_TOKENS: Token[] = [
  {
    symbol: 'ETH',
    name: 'Ether',
    decimals: 18,
    address: {
      mainnet: process.env.NEXT_PUBLIC_ETH_ADDRESS_MAINNET || '',
      testnet: process.env.NEXT_PUBLIC_ETH_ADDRESS_TESTNET || '',
    },
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    decimals: 6,
    address: {
      mainnet: process.env.NEXT_PUBLIC_USDT_ADDRESS_MAINNET || '',
      testnet: process.env.NEXT_PUBLIC_USDT_ADDRESS_TESTNET || '',
    },
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    address: {
      mainnet: process.env.NEXT_PUBLIC_USDC_ADDRESS_MAINNET || '',
      testnet: process.env.NEXT_PUBLIC_USDC_ADDRESS_TESTNET || '',
    },
  },
  {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    address: {
      mainnet: process.env.NEXT_PUBLIC_DAI_ADDRESS_MAINNET || '',
      testnet: process.env.NEXT_PUBLIC_DAI_ADDRESS_TESTNET || '',
    },
  },
  {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
    address: {
      mainnet: process.env.NEXT_PUBLIC_WETH_ADDRESS_MAINNET || '',
      testnet: process.env.NEXT_PUBLIC_WETH_ADDRESS_TESTNET || '',
    },
  },
  {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    address: {
      mainnet: process.env.NEXT_PUBLIC_WBTC_ADDRESS_MAINNET || '',
      testnet: process.env.NEXT_PUBLIC_WBTC_ADDRESS_TESTNET || '',
    },
  },
  {
    symbol: 'UNI',
    name: 'Uniswap',
    decimals: 18,
    address: {
      mainnet: process.env.NEXT_PUBLIC_UNI_ADDRESS_MAINNET || '',
      testnet: process.env.NEXT_PUBLIC_UNI_ADDRESS_TESTNET || '',
    },
  },
  {
    symbol: 'AAVE',
    name: 'Aave',
    decimals: 18,
    address: {
      mainnet: process.env.NEXT_PUBLIC_AAVE_ADDRESS_MAINNET || '',
      testnet: process.env.NEXT_PUBLIC_AAVE_ADDRESS_TESTNET || '',
    },
  },
  {
    symbol: 'SUSHI',
    name: 'SushiSwap',
    decimals: 18,
    address: {
      mainnet: process.env.NEXT_PUBLIC_SUSHI_ADDRESS_MAINNET || '',
      testnet: process.env.NEXT_PUBLIC_SUSHI_ADDRESS_TESTNET || '',
    },
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    decimals: 18,
    address: {
      mainnet: process.env.NEXT_PUBLIC_LINK_ADDRESS_MAINNET || '',
      testnet: process.env.NEXT_PUBLIC_LINK_ADDRESS_TESTNET || '',
    },
  },
  {
    symbol: 'MKR',
    name: 'MakerDAO',
    decimals: 18,
    address: {
      mainnet: process.env.NEXT_PUBLIC_MKR_ADDRESS_MAINNET || '',
      testnet: process.env.NEXT_PUBLIC_MKR_ADDRESS_TESTNET || '',
    },
  },
  {
    symbol: 'COMP',
    name: 'Compound',
    decimals: 18,
    address: {
      mainnet: process.env.NEXT_PUBLIC_COMP_ADDRESS_MAINNET || '',
      testnet: process.env.NEXT_PUBLIC_COMP_ADDRESS_TESTNET || '',
    },
  },
  {
    symbol: 'SNX',
    name: 'Synthetix',
    decimals: 18,
    address: {
      mainnet: process.env.NEXT_PUBLIC_SNX_ADDRESS_MAINNET || '',
      testnet: process.env.NEXT_PUBLIC_SNX_ADDRESS_TESTNET || '',
    },
  },
  {
    symbol: 'BAT',
    name: 'Basic Attention Token',
    decimals: 18,
    address: {
      mainnet: process.env.NEXT_PUBLIC_BAT_ADDRESS_MAINNET || '',
      testnet: process.env.NEXT_PUBLIC_BAT_ADDRESS_TESTNET || '',
    },
  },
  {
    symbol: 'YFI',
    name: 'Yearn Finance',
    decimals: 18,
    address: {
      mainnet: process.env.NEXT_PUBLIC_YFI_ADDRESS_MAINNET || '',
      testnet: process.env.NEXT_PUBLIC_YFI_ADDRESS_TESTNET || '',
    },
  },
  {
    symbol: 'CRV',
    name: 'Curve Finance',
    decimals: 18,
    address: {
      mainnet: process.env.NEXT_PUBLIC_CRV_ADDRESS_MAINNET || '',
      testnet: process.env.NEXT_PUBLIC_CRV_ADDRESS_TESTNET || '',
    },
  },
];

export const getTokenBySymbol = (symbol: string): Token | undefined => {
  return SUPPORTED_TOKENS.find((token) => token.symbol === symbol);
};

export const getTokenAddress = (symbol: string, network: 'mainnet' | 'testnet'): string => {
  const token = getTokenBySymbol(symbol);
  if (!token) throw new Error(`Token ${symbol} not found`);
  return token.address[network];
};

// Additional helper functions
export const getTokenDecimals = (symbol: string): number => {
  const token = getTokenBySymbol(symbol);
  if (!token) throw new Error(`Token ${symbol} not found`);
  return token.decimals;
};

export const getAllTokenSymbols = (): string[] => {
  return SUPPORTED_TOKENS.map(token => token.symbol);
}; 