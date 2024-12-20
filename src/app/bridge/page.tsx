"use client";

import { BridgeForm } from '@/components/BridgeForm';

export default function BridgePage() {
  return (
    <div className="flex flex-col items-center justify-start pt-8 min-h-screen">
      <h1 className="text-2xl font-bold mb-8">Bridge</h1>
      <BridgeForm />
    </div>
  );
} 