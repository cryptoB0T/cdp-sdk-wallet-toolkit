

<img src=https://assets.rbl.ms/34660828/origin.gif />
 
 There's no easy way to understand this for a noob.  The best way to explain this might actually be different depending on that individual's pre-existing knowledge. So I don't think there's a really straightforward way or universal way to make this all really easy to understand.

 But in the spirit of paying it forward and to put this in writing so future me may be able to wrap my head around this if I forget how some of this works, I'm going to put some notes here.

 These are four links that might be relevant, and there are absolutely more. 

 So a smart wallet, which was in the wallet API v1, has essentially been superseded by a smart account. but the base stocks still identify it as a smart wallet and it is pretty much known as either a smart wallet or a smart account at this point. 

 So, in an effort to make things easier for noobs to understand, then Coinbase has a very straightforward docs page for their wallet API v2, which is essentially their Coinbase SDK, which now has been renamed to cdp-sdk.

 But the SDK will often be a few steps behind the functionality they expose via their REST APIs. And so, by nature, that will always be the case.

 So, to really understand what's happening in their SDK, you would need some kind of CDP SDK API docs. But those having to be manually maintained will never be really as good as generated docs. Generated docs are almost like unit tests. They will live with the code, and when the code changes, the unit tests will also have to change. And when the code changes, the generated docs will change. But the manually handwritten docs will change depending on whenever that's manually done. So that's probably the least reliable source.

- https://docs.base.org/identity/smart-wallet/quickstart
- https://docs.cdp.coinbase.com/wallet-api-v2/docs/welcome
- https://docs.cdp.coinbase.com/api-v2/docs/welcome
- https://coinbase.github.io/cdp-sdk/typescript/

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

This project runs on Next.js and is hosted on Vercel. 

## Contributing

Feel free to explore, test, and contribute to this implementation examples project. Open issues for bugs or feature requests.
