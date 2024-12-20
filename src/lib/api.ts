import axios from 'axios';
import type { NetworkStats, Block, Transaction, CrossChainTx, Proposal } from '@/types/api';

interface ProposalsResponse {
  totalActive: number;
  proposals: Proposal[];
  lastUpdated: number;
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const api = {
  testConnection: () => apiClient.get<{ message: string }>('/test'),
  getNetworkStats: () => apiClient.get<NetworkStats>('/stats/network'),
  getLatestBlock: () => apiClient.get<Block>('/stats/blocks/latest'),
  getTransactions: () => apiClient.get<Transaction[]>('/stats/transactions'),
  getCrossChainTxs: () => apiClient.get<CrossChainTx[]>('/stats/cross-chain'),
  getProposals: () => apiClient.get<ProposalsResponse>('/community/proposals')
}; 