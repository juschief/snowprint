"use client";

import { BridgeForm } from '@/components/BridgeForm';

export default function Bridge() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl md:text-4xl font-bold mb-8 text-blue-500">
        Avalanche Token Bridge
      </h1>
      <BridgeForm />
    </div>
  );
} 