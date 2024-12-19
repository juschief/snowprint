"use client";

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { NetworkActivityChart } from './NetworkCharts';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function NetworkStats() {
  const [labels, setLabels] = useState<string[]>([]);
  const [tpsData, setTpsData] = useState<number[]>([]);
  const [activeAddresses, setActiveAddresses] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Generate last 7 days for labels
        const dates = Array.from({length: 7}, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        setLabels(dates);

        // Simulated data for TPS and active addresses
        const simulatedTPS = dates.map(() => Math.floor(Math.random() * (5000 - 4000) + 4000));
        const simulatedAddresses = dates.map(() => Math.floor(Math.random() * (50000 - 30000) + 30000));
        
        setTpsData(simulatedTPS);
        setActiveAddresses(simulatedAddresses);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: 'white' },
      },
      title: {
        display: true,
        color: 'white',
      },
    },
    scales: {
      y: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl h-[300px] flex justify-center items-center">
        <div className="text-white">Loading network stats...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl">
      <h2 className="text-2xl font-bold mb-4">Network Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* AVAX Price Chart (TradingView) */}
        <div className="bg-zinc-800 rounded-lg p-4">
          <h3 className="text-xl mb-4">AVAX Price</h3>
          <NetworkActivityChart />
        </div>

        {/* Gas Usage Chart (Chart.js) */}
        <div className="bg-zinc-800 rounded-lg p-4">
          <h3 className="text-xl mb-4">Transactions Per Second</h3>
          <div className="h-[300px]">
            <Line 
              options={chartOptions} 
              data={{
                labels,
                datasets: [{
                  label: 'TPS',
                  data: tpsData,
                  borderColor: '#E84142',
                  backgroundColor: 'rgba(232, 65, 66, 0.5)',
                  tension: 0.4,
                }]
              }} 
            />
          </div>
        </div>

        {/* Active Addresses Chart (Chart.js) */}
        <div className="bg-zinc-800 rounded-lg p-4">
          <h3 className="text-xl mb-4">Active Addresses</h3>
          <div className="h-[300px]">
            <Line 
              options={chartOptions} 
              data={{
                labels,
                datasets: [{
                  label: 'Active Addresses',
                  data: activeAddresses,
                  borderColor: '#4BC0C0',
                  backgroundColor: 'rgba(75, 192, 192, 0.5)',
                  tension: 0.4,
                }]
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
} 