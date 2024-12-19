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
      snowflake.className = 'absolute text-white/70 animate-fall text-lg';
      snowflake.style.left = `${Math.random() * 100}%`;
      snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`;
      container.appendChild(snowflake);

      setTimeout(() => {
        snowflake.remove();
      }, 5000);
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
      <span className="inline-block -skew-x-6 text-white relative z-10 text-2xl font-bold">
        Snowprint
      </span>
    </div>
  );
} 