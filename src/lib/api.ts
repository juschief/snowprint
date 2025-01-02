import axios from 'axios';
import type { NetworkStats, Block, Transaction, CrossChainTx, Proposal } from '@/types/api';

interface ProposalsResponse {
  totalActive: number;
  proposals: Proposal[];
  lastUpdated: number;
}

// Create backend client
const backendClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

const SNOWTRACE_API_KEY = process.env.SNOWTRACE_API_KEY;
const SNOWTRACE_BASE_URL = 'https://api.snowtrace.io/api';

export const api = {
  testConnection: async () => {
    try {
      const res = await backendClient.get('/test');
      return res.data;
    } catch (error) {
      console.error('Error testing connection:', error);
      throw error;
    }
  },

  getNetworkStats: async () => {
    try {
      const res = await backendClient.get('/stats/network');
      return res.data;
    } catch (error) {
      console.error('Network stats error:', error);
      throw error;
    }
  },

  getLatestBlock: async () => {
    try {
      const res = await backendClient.get('/stats/blocks/latest');
      return res.data;
    } catch (error) {
      console.error('Latest block error:', error);
      throw error;
    }
  },

  getTransactions: async () => {
    try {
      const res = await backendClient.get('/stats/transactions');
      return res.data;
    } catch (error) {
      console.error('Transactions error:', error);
      throw error;
    }
  },

  getCrossChainTxs: async () => {
    try {
      const res = await backendClient.get('/stats/cross-chain');
      return res.data;
    } catch (error) {
      console.error('Cross-chain error:', error);
      throw error;
    }
  },

  getProposals: async () => {
    try {
      const res = await backendClient.get('/community/proposals');
      return res.data;
    } catch (error) {
      console.error('Proposals error:', error);
      throw error;
    }
  },

  getValidatorData: async () => {
    try {
      const response = await axios.get(`${SNOWTRACE_BASE_URL}`, {
        params: {
          module: 'stats',
          action: 'validators',
          apikey: SNOWTRACE_API_KEY,
        },
      });
      return response.data.result;
    } catch (error) {
      console.error('Error fetching validator data:', error);
      throw error;
    }
  },

  getLatencyData: async () => {
    try {
      const response = await axios.get(`${SNOWTRACE_BASE_URL}`, {
        params: {
          module: 'stats',
          action: 'latency',
          apikey: SNOWTRACE_API_KEY,
        },
      });
      return response.data.result;
    } catch (error) {
      console.error('Error fetching latency data:', error);
      throw error;
    }
  }
};