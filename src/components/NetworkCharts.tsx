"use client";

import { useEffect } from 'react';

declare const TradingView: any;

export function NetworkActivityChart() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      new TradingView.widget({
        width: '100%',
        height: 300,
        symbol: 'BINANCE:AVAXUSDT',
        interval: 'D',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: 'network_activity_chart',
        studies: [
          'Volume@tv-basicstudies'
        ]
      });
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return <div id="network_activity_chart" />;
} 