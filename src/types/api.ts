export interface BaseResponse<T> {
  data: T;
  error?: string;
}

export interface NetworkStats {
  blockNumber: number;
  gasPrice: string;
  tps: number;
  activeAddresses: number;
  totalTransactions24h: number;
}

export interface Block {
  number: number;
  hash: string;
  timestamp: number;
  transactions: string[];
}

export interface Transaction {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  timestamp: number;
  blockNumber: number;
  gasUsed: string;
  status: boolean;
}

export interface CrossChainTx {
  sourceChain: string;
  destinationChain: string;
  hash: string;
  timestamp: number;
  amount: string;
  token: string;
  status: 'Completed' | 'Pending' | 'Failed';
  type: 'Bridge' | 'Swap' | 'Transfer';
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  status: 'Active' | 'Closed';
  votingEnds: string;
  votesFor: number;
  votesAgainst: number;
  proposer: string;
  link: string;
} 