export interface Token {
  symbol: string;
  name: string;
  decimals: number;
  address: {
    mainnet: string;
    testnet: string;
  };
  logoUrl?: string;
}

export const SUPPORTED_TOKENS: Token[] = [
  {
    symbol: 'AVAX',
    name: 'Avalanche',
    decimals: 18,
    address: {
      mainnet: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
      testnet: '0xd00ae08403B9bbb9124bB305C09058E32C39A48c' // Fuji WAVAX
    },
    logoUrl: '/tokens/avax.png'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    address: {
      mainnet: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
      testnet: '0x5425890298aed601595a70AB815c96711a31Bc65' // Fuji USDC
    },
    logoUrl: '/tokens/usdc.png'
  }
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