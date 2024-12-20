# Snowprint - Avalanche Network Explorer

A modern, real-time explorer for the Avalanche network that provides detailed insights into network activity, transactions, and cross-chain operations.

## Features

- Real-time network statistics
- Latest blocks and transactions
- Cross-chain activity monitoring
- Community proposals tracking
- Network health indicators
- Mobile-responsive design

## Tech Stack

- Frontend: Next.js 13+, TailwindCSS, TypeScript
- Backend: Node.js, Express, ethers.js
- Network: Avalanche RPC, Snowtrace API

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/juschief/snowprint.git
```

2. Navigate to the project directory:

```bash
cd snowprint
```

3. Install dependencies:

```bash
yarn
```

4. Set up environment variables:

```env:.env.example
# Network Configuration
NEXT_PUBLIC_NETWORK=testnet  # or mainnet
NEXT_PUBLIC_AVALANCHE_RPC_TESTNET=https://api.avax-test.network/ext/bc/C/rpc
NEXT_PUBLIC_AVALANCHE_RPC_MAINNET=https://api.avax.network/ext/bc/C/rpc

# Bridge Configuration
NEXT_PUBLIC_BRIDGE_ADDRESS_TESTNET=0x...  # Testnet bridge address
NEXT_PUBLIC_BRIDGE_ADDRESS_MAINNET=0x...  # Mainnet bridge address

# Explorer Configuration
NEXT_PUBLIC_EXPLORER_TESTNET=https://testnet.snowtrace.io
NEXT_PUBLIC_EXPLORER_MAINNET=https://snowtrace.io
```

5. Start development server:

```bash
yarn dev
```

6. Create a production build:

```bash
yarn build
```

7. Preview the production build:

```bash
yarn start
```

## Resources

- [Documentation](https://portal.thirdweb.com/typescript/v5)
- [Templates](https://thirdweb.com/templates)
- [YouTube](https://www.youtube.com/c/thirdweb)
- [Blog](https://blog.thirdweb.com)

## Need help?

For help or feedback, please [visit our support site](https://thirdweb.com/support)
