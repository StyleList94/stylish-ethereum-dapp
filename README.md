# Stylish Ethereum DApp

Create stylish Ethereum Dapp

## Feature

### Account

- connect/Disconnect wallet
- account status

### Network

- network status
- switching network

### Smart contract launcher

- read/white the function specified in the ABI
- includes ERC20, ERC721, ERC4626 ABI

### Unit converter

- convert Ether to Gwei, Wei

### Sign message

- signing a message
- recover signed address

### Send transaction

- send native token

### Transaction center

- watching pending transaction
- latest tx receipt
- toasting transaction status

### Metadata

- error boundary component
- custom 404 Not found page
- images(icon, opengraph)

## Tech Spec

Core
- React
- Next.js

EVM
- wagmi
- viem

State management
- zustand
 
Styling
- tailwindcss
- shadcn/ui

Testing
- Vitest
- React Testing Library

Code Formatter
- ESLint
- Prettier

## Getting Started

```bash
yarn create next-app --example https://github.com/StyleList94/stylish-ethereum-dapp
```

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FStyleList94%2Fstylish-ethereum-dapp)
