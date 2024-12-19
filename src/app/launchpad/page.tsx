"use client";

import { LaunchpadForm } from '@/components/LaunchpadForm';

export default function Launchpad() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl md:text-4xl font-bold mb-8 text-white">
        Launch Your L1 on Avalanche +Snowprint
      </h1>
      <LaunchpadForm />
    </div>
  );
} 