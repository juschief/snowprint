"use client";

import { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { api } from '@/lib/api';

interface Proposal {
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

declare const TradingView: any;

Chart.register(...registerables);

export function NetworkCharts() {
  const tvlChartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    // Load TradingView for price chart
    const loadTradingViewScript = () => {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        new TradingView.widget({
          width: '100%',
          height: 400,
          symbol: 'BINANCE:AVAXUSDT',
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#1f2937',
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          container_id: 'price_chart',
          hide_volume: true,
          backgroundColor: 'rgba(17, 24, 39, 0.7)',
          gridColor: 'rgba(255, 255, 255, 0.05)',
          studies: [
            'MASimple@tv-basicstudies',
            'RSI@tv-basicstudies'
          ]
        });
      };
      document.head.appendChild(script);
      return script;
    };

    const script = loadTradingViewScript();

    // Initialize TVL chart
    const initTVLChart = () => {
      const ctx = tvlChartRef.current?.getContext('2d');
      if (!ctx) return;

      // Mock data - replace with real data from your API
      const labels = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      });
      
      // Generate mock TVL data with a realistic trend
      const baseValue = 5000000000; // $5B base TVL
      const data = labels.map((_, i) => {
        const trend = Math.sin(i / 5) * 500000000; // Add some wave pattern
        const noise = (Math.random() - 0.5) * 200000000; // Add some noise
        return baseValue + trend + noise;
      });

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Total Value Locked',
            data,
            borderColor: 'rgba(59, 130, 246, 0.8)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHitRadius: 10,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: 'index',
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(17, 24, 39, 0.9)',
              titleColor: 'rgba(255, 255, 255, 0.9)',
              bodyColor: 'rgba(255, 255, 255, 0.9)',
              borderColor: 'rgba(59, 130, 246, 0.5)',
              borderWidth: 1,
              callbacks: {
                label: (context) => {
                  const value = context.raw as number;
                  return `TVL: $${(value / 1e9).toFixed(2)}B`;
                }
              }
            }
          },
          scales: {
            x: {
              border: {
                display: false
              },
              grid: {
                display: false,
                drawTicks: false
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.5)',
                font: {
                  size: 11
                },
                maxRotation: 0
              }
            },
            y: {
              border: {
                display: false
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)',
                drawTicks: false
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.5)',
                font: {
                  size: 11
                },
                callback: (value: any) => `$${(Number(value) / 1e9).toFixed(1)}B`
              }
            }
          }
        }
      });
    };

    // Add this function to fetch proposals
    const fetchProposals = async () => {
      try {
        const response = await api.getProposals();
        setProposals(response.data.proposals);
      } catch (error) {
        console.error('Failed to fetch proposals:', error);
      }
    };

    const initCharts = async () => {
      try {
        initTVLChart();
        await fetchProposals();
      } catch (error) {
        console.error('Error initializing:', error);
      }
    };

    initCharts();
    const interval = setInterval(initCharts, 300000);

    return () => {
      if (script && document.head.contains(script)) {
        document.head.removeChild(script);
      }
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-zinc-800/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-blue-500 mb-4">AVAX Price</h2>
        <div id="price_chart" className="rounded-lg overflow-hidden" />
      </div>
      <div className="bg-zinc-800/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-blue-500 mb-4">Total Value Locked (30d)</h2>
        <div className="h-[400px]">
          <canvas ref={tvlChartRef} />
        </div>
      </div>
      <div className="bg-zinc-800/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-blue-500 mb-4">Active Proposals</h2>
        <div className="h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-zinc-700">
          {proposals.length > 0 ? (
            <div className="space-y-4">
              {proposals.map((proposal) => (
                <div 
                  key={proposal.id}
                  className="bg-zinc-700/50 rounded-lg p-4 hover:bg-zinc-700/70 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-white">{proposal.title}</h3>
                    <span className="text-sm text-blue-400">{proposal.id}</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                    {proposal.description}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex space-x-4">
                      <span className="text-green-400">
                        For: {proposal.votesFor.toLocaleString()}
                      </span>
                      <span className="text-red-400">
                        Against: {proposal.votesAgainst.toLocaleString()}
                      </span>
                    </div>
                    <a 
                      href={proposal.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      View Details →
                    </a>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    Ends: {new Date(proposal.votingEnds).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Loading proposals...
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 