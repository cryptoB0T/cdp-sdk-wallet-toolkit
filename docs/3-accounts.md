Title: Accounts | Coinbase Developer Documentation

URL Source: https://docs.cdp.coinbase.com/wallet-api-v2/docs/accounts

Markdown Content:
Overview[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/accounts#overview "Direct link to Overview")
--------------------------------------------------------------------------------------------------------

**Accounts** refer to an address on a blockchain that has the ability to sign transactions on behalf of the address, allowing you to not only send and receive funds, but also interact with smart contracts. Cryptographically, an account corresponds to a **private/public key pair**.

Note

**Accounts** are a term consistent across the crypto ecosystem: [Ethereum](https://ethereum.org/en/glossary/#section-a), [Solana](https://solana.com/docs/core/accounts), and [viem](https://viem.sh/docs/faq#why-use-the-terms-wallet--account-instead-of-signer) use this term to refer to the same concept.

The v2 Wallet APIs support the following account types:

*   **EVM Compatible Accounts**:
    *   **EOAs**: [Externally Owned Accounts](https://ethereum.org/en/developers/docs/accounts/) on any EVM-compatible blockchain that have the ability to sign transactions on behalf of an account's address (i.e., when using a smart account).
    *   **Smart Account**: A smart contract-based account that can provide advanced functionality such as gas sponsorships and spend permissions.
*   **Solana Accounts**: An account on the Solana blockchain.

Tip

More code samples are available in our [Typescript](https://github.com/coinbase/cdp-sdk/blob/main/examples/typescript) and [Python](https://github.com/coinbase/cdp-sdk/tree/main/examples/python) SDK repositories.

EVM compatible networks[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/accounts#evm-compatible-networks "Direct link to EVM compatible networks")
--------------------------------------------------------------------------------------------------------------------------------

The v2 Wallet API supports both EOAs and smart accounts on EVM-compatible networks.

### Externally Owned Accounts (EOAs)[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/accounts#externally-owned-accounts-eoas "Direct link to Externally Owned Accounts (EOAs)")

Refer to the [quickstart](https://docs.cdp.coinbase.com/wallet-api-v2/docs/quickstart) for an example of creating an EOA and sending a transaction with it.

### Smart accounts[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/accounts#smart-accounts "Direct link to Smart accounts")

A **Smart account** operates through a smart contract (programmable code stored directly on the blockchain).

A smart account requires an **owner** account to sign on its behalf. The owner can be a CDP Account or an account secured by the developer using a library such as [viem](https://viem.sh/).

Smart accounts execute actions using [**user operations**](https://www.erc4337.io/docs/understanding-ERC-4337/user-operation) onchain via [EIP-4337 Account Abstraction](https://www.erc4337.io/docs).

See the [smart account documentation](https://docs.cdp.coinbase.com/wallet-api-v2/docs/smart-accounts) to learn how to create a smart account and submit a user operation.

Solana[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/accounts#solana "Direct link to Solana")
--------------------------------------------------------------------------------------------------

**Solana accounts** correspond to [Accounts](https://solana.com/docs/core/accounts) on the Solana network.

Refer to the [quickstart](https://docs.cdp.coinbase.com/wallet-api-v2/docs/quickstart#use-solana-accounts) for an example of creating a Solana account and sending a transaction with it.

What to read next[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/accounts#what-to-read-next "Direct link to What to read next")
--------------------------------------------------------------------------------------------------------------------------------

*   [**v2 Security**](https://docs.cdp.coinbase.com/wallet-api-v2/docs/security): Learn about the security features of v2 Wallet API.
*   [**API Reference**](https://docs.cdp.coinbase.com/api-v2/docs/welcome): Explore the complete API reference for v2 Wallet API.