"use client";

import { useEffect, useRef } from 'react';

export function SnowprintLogo() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createSnowflake = () => {
      const snowflake = document.createElement('div');
      snowflake.innerHTML = '❄';
      snowflake.className = 'absolute text-white/40 animate-fall text-sm';
      snowflake.style.left = `${Math.random() * 100}%`;
      snowflake.style.animationDuration = `${Math.random() * 2 + 2}s`;
      container.appendChild(snowflake);

      setTimeout(() => {
        snowflake.remove();
      }, 3000);
    };

    const interval = setInterval(createSnowflake, 500);

    return () => {
      clearInterval(interval);
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="relative inline-block">
      <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none" />
      <span className="inline-block text-white relative z-10 text-2xl font-bold tracking-tight hover:text-gray-200 transition-colors duration-200">
        Snowprint
      </span>
    </div>
  );
} 