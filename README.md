
# CDP SDK Implementation Examples

This project serves as a laboratory for exploring and implementing the Coinbase Developer Platform (CDP) SDK. It demonstrates various implementation methods using both the SDK directly and REST API endpoints.

## Overview

This experimental implementation showcases the CDP SDK's capabilities across multiple categories, providing practical examples for developers to understand and utilize the platform's features.

## Features Implementation Status

The project implements features across 7 major categories. Below is the current implementation status:

### ✅ Fully Implemented Features

#### Account Management
- EVM account creation
- Solana account creation
- EVM Compatible Accounts (EOAs)
- Solana Accounts
- Account naming
- Account listing

#### Smart Accounts
- EVM Smart Accounts
- Smart account creation
- User operation sending

#### Security
- Trusted Execution Environment (TEE)
- Single Wallet Secret for all accounts

#### Network Support
- Multi-network support for EVM accounts
- Solana account support

#### Integration & Compatibility
- viem compatibility
- viem Wallet Client integration

#### Other Features
- USDC Rewards program integration (4.1% rewards)

### 🚧 In Progress/Partial Implementation

#### Account Management
- Account retrieval by name
- Pagination for account listing

#### Smart Accounts
- Smart account owner management
- Batching calls within operations

#### Transaction Management
- Transaction signing and broadcasting
- Automatic gas estimation
- Nonce management
- Solana transaction batching

### ⏳ Planned Features

#### Smart Accounts
- Gas sponsorship (EVM)
- Spend permissions (EVM)

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and add your CDP credentials:
   - CDP_API_KEY_ID
   - CDP_API_KEY_SECRET
   - CDP_WALLET_SECRET

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

## Implementation Examples

### SDK Methods
The project showcases SDK implementations in `/pages/api/`:
- `create-wallet.ts`: Direct SDK wallet creation
- `create-smart-account.ts`: Smart account creation
- `send-user-operation.ts`: User operation handling

### REST API Methods
REST API implementations can be found in:
- `create-wallet-direct.ts`: Direct API wallet creation
- `list-accounts.ts`: Account listing via API
- `send-transaction.ts`: Transaction sending via API

## Project Structure

```
├── components/        # React components
├── pages/            # Next.js pages and API routes
├── lib/              # Utility functions and configurations
└── docs/            # Implementation documentation
```

## Development

This project runs on Next.js and is hosted on Replit. The development server will be available at `http://0.0.0.0:3000`.

## Contributing

Feel free to explore, test, and contribute to this implementation examples project. Open issues for bugs or feature requests.
