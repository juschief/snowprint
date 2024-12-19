"use client";

import { ThirdwebProvider } from "thirdweb/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider
      clientId="27bc4e3c2eb6885e645388909d443a06"
      activeChain="avalanche"
    >
      {children}
    </ThirdwebProvider>
  );
} 