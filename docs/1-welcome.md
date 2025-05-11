Title: Welcome to Wallet API v2 | Coinbase Developer Documentation

URL Source: https://docs.cdp.coinbase.com/wallet-api-v2/docs/welcome

Markdown Content:
Note

The v2 Wallet API is currently in Alpha. Reach out in the **#wallet-api** channel of the [CDP Discord](https://discord.com/invite/cdp) for any questions.

Overview[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/welcome#overview "Direct link to Overview")
-------------------------------------------------------------------------------------------------------

The v2 Wallet API enables developers to programmatically create, manage, and use crypto accounts while CDP secures the private keys and handles complex infrastructure management. Developers can access the v2 Wallet API through either the [CDP SDK](https://github.com/coinbase/cdp-sdk) or [CDP's REST endpoints](https://docs.cdp.coinbase.com/api-v2/docs/welcome).

The following table summarizes the key differences between v1 and v2 Wallet APIs:

| 
Feature



 | 

v1 Wallet API 🔴



 | 

v2 Wallet API 🟢



 |
| --- | --- | --- |
| 

Security management



 | 

Complex



 | 

Easy



 |
| 

Private key security



 | 

Developer-managed



 | 

Secured in [AWS Nitro Enclave TEE](https://docs.cdp.coinbase.com/wallet-api-v2/docs/security)



 |
| 

Authentication



 | 

One secret per account



 | 

Single secret for all accounts



 |
| 

Network support



 | 

EVM only



 | 

EVM and Solana



 |
| 

EVM account scope



 | 

Single EVM network



 | 

Multiple EVM networks



 |
| 

Transaction batching



 |  |  |
| 

Gas sponsorship



 |  |  |
| 

Spend permissions



 |  |  |
| 

Viem compatibility



 |  |  |

  

Secure key management[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/welcome#secure-key-management "Direct link to Secure key management")
--------------------------------------------------------------------------------------------------------------------------------

Instead of securing your own private keys or needing to set up [Server-Signer infrastructure](https://docs.cdp.coinbase.com/wallet-api/docs/serversigners), the v2 Wallet API greatly simplifies crypto key management by signing all of your transactions within a [Trusted Execution Environment (TEE)](https://docs.cdp.coinbase.com/wallet-api-v2/docs/security).

The TEE ensures that sensitive cryptographic material is never exposed to the outside world - not even to Coinbase!

Info

The Trusted Execution Environment (TEE) provides a secure environment for signing your transactions, and ensures that your private keys are never exposed to Coinbase, AWS, or the outside world. Read more in our [Security documentation](https://docs.cdp.coinbase.com/wallet-api-v2/docs/security).

### Single secret authentication[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/welcome#single-secret-authentication "Direct link to Single secret authentication")

In the v2 Wallet API, a single [Wallet Secret](https://docs.cdp.coinbase.com/wallet-api-v2/docs/security#wallet-secrets) grants access to all of your accounts across both the EVM and Solana ecosystems. This single secret is used for sensitive wallet operations, such as account creation and transaction signing.

### Rotatable Wallet Secret[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/welcome#rotatable-wallet-secret "Direct link to Rotatable Wallet Secret")

In case your Wallet Secret is lost or compromised, you can [rotate your secret](https://docs.cdp.coinbase.com/wallet-api-v2/docs/update-wallet-secret) at any time.

Multi-network support[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/welcome#multi-network-support "Direct link to Multi-network support")
--------------------------------------------------------------------------------------------------------------------------------

Rather than limiting usage to a single EVM network, EVM accounts created using the v2 Wallet API are compatible across all EVM chains.

The v2 Wallet API also supports Solana accounts, allowing you to create and manage Solana accounts in addition to EVM accounts.

Smart accounts[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/welcome#smart-accounts "Direct link to Smart accounts")
-------------------------------------------------------------------------------------------------------------------------

The v2 Wallet API supports EIP-4337 [smart accounts](https://docs.cdp.coinbase.com/wallet-api-v2/docs/smart-accounts), which provide the following advanced features via smart contract calls:

*   [Transaction batching](https://docs.cdp.coinbase.com/wallet-api-v2/docs/smart-accounts#3-batch-calls-within-a-single-user-operation)
*   Gas sponsorship (guide coming soon)
*   Spend permissions (guide coming soon)

More on smart accounts

viem compatibility[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/welcome#viem-compatibility "Direct link to viem compatibility")
--------------------------------------------------------------------------------------------------------------------------------

EVM Accounts in the v2 Wallet API can be used directly with [viem](https://viem.sh/) as [custom accounts](https://viem.sh/docs/accounts/local/toAccount#toaccount). This allows you to leverage viem's widely-used abstractions seamlessly with the [CDP SDK](https://github.com/coinbase/cdp-sdk). Refer to the [viem compatibility guide](https://docs.cdp.coinbase.com/wallet-api-v2/docs/viem-compatibility) for more details.

Support and feedback[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/welcome#support-and-feedback "Direct link to Support and feedback")
--------------------------------------------------------------------------------------------------------------------------------

Join **#wallet-api** in the [CDP Discord](https://discord.com/invite/cdp) to access FAQs, schedule project discussions, and connect with other developers. We welcome your feedback and suggestions for improvement.

What to read next[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/welcome#what-to-read-next "Direct link to What to read next")
--------------------------------------------------------------------------------------------------------------------------------

*   [Quickstart](https://docs.cdp.coinbase.com/wallet-api-v2/docs/quickstart): Create onchain accounts and send funds within minutes using the v2 Wallet API.
*   [Security](https://docs.cdp.coinbase.com/wallet-api-v2/docs/security): Learn about new security features and how the v2 Wallet API protects your private keys.
*   [Accounts](https://docs.cdp.coinbase.com/wallet-api-v2/docs/accounts): Descriptions of v2-supported account types and how to use them.
*   [API Reference](https://docs.cdp.coinbase.com/api-v2/docs/welcome): Full API reference for the v2 Wallet API.