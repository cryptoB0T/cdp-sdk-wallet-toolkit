Title: viem Compatibility | Coinbase Developer Documentation

URL Source: https://docs.cdp.coinbase.com/wallet-api-v2/docs/viem-compatibility

Markdown Content:
[![Image 1: Coinbase Docs](https://docs.cdp.coinbase.com/img/logo_light.svg)](https://docs.cdp.coinbase.com/)

Overview[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/viem-compatibility#overview "Direct link to Overview")
------------------------------------------------------------------------------------------------------------------

The CDP SDK is compatible with [viem](https://viem.sh/docs/getting-started) in a couple ways:

1.  viem Local Accounts can be set as the owner of a CDP Smart Account. See the [Signer Example](https://docs.cdp.coinbase.com/wallet-api-v2/docs/viem-compatibility#signer-example) below.
2.  CDP accounts can be wrapped into viem Custom Accounts using the [toAccount](https://viem.sh/docs/accounts/local/toAccount) function. See the [Wallet Client Example](https://docs.cdp.coinbase.com/wallet-api-v2/docs/viem-compatibility#wallet-client-example) below.

Signer Example[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/viem-compatibility#signer-example "Direct link to Signer Example")
--------------------------------------------------------------------------------------------------------------------------------

You can create a viem Local Account and set it as the owner of a CDP Smart Account.

main.ts

```
import { CdpClient } from "@coinbase/cdp-sdk";import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";import dotenv from "dotenv";dotenv.config();const cdp = new CdpClient();const privateKey = generatePrivateKey();const owner = privateKeyToAccount(privateKey);const smartAccount = await cdp.evm.createSmartAccount({ owner });
```

Wallet Client Example[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/viem-compatibility#wallet-client-example "Direct link to Wallet Client Example")
--------------------------------------------------------------------------------------------------------------------------------

You can pass a CDP account to the `toAccount` function and get back a viem Custom Account, which can be used wherever viem expects an account. For example, you can create a viem [Wallet Client](https://viem.sh/docs/clients/wallet) from this account and use the Wallet Client to send transactions.

The following code snippet demonstrates how to use a viem Wallet Client to send a transaction.

If you followed the [quickstart](https://docs.cdp.coinbase.com/wallet-api-v2/docs/quickstart#project-setup), you will have a project that you can use to follow along with the example below.

### 1\. Install viem[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/viem-compatibility#1-install-viem "Direct link to 1. Install viem")

Install `viem` in your project:

```
npm install viem
```

### 2\. Create a Wallet Client from a CDP account[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/viem-compatibility#2-create-a-wallet-client-from-a-cdp-account "Direct link to 2. Create a Wallet Client from a CDP account")

Here we use `toAccount` from `viem/accounts` to wrap a CDP account in a viem Custom Account, which is immediately passed to the `createWalletClient` function to create a viem Wallet Client.

main.ts

```
import { CdpClient } from "@coinbase/cdp-sdk";import { createWalletClient } from "viem";import { toAccount } from "viem/accounts";import { baseSepolia } from "viem/chains";import dotenv from "dotenv";dotenv.config();const cdp = new CdpClient();const account = await cdp.evm.createAccount();console.log("Created account:", account.address);const walletClient = createWalletClient({  account: toAccount(account),  chain: baseSepolia,  transport: http(),});
```

### 3\. Send a transaction with the Wallet Client[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/viem-compatibility#3-send-a-transaction-with-the-wallet-client "Direct link to 3. Send a transaction with the Wallet Client")

Next, use the Wallet Client to send a transaction, after requesting some testnet ETH from the faucet.

main.ts

```
import { http, createPublicClient, parseEther } from "viem";import dotenv from "dotenv";dotenv.config();const cdp = new CdpClient();// ... existing code ...// This is used to wait for transaction confirmationconst publicClient = createPublicClient({  chain: baseSepolia,  transport: http(),});console.log("Requesting testnet ETH from faucet...");const { transactionHash: faucetTransactionHash } = await cdp.evm.requestFaucet({  address: account.address,  network: "base-sepolia",  token: "eth",});console.log("Waiting for funds to arrive...");const faucetTxReceipt = await publicClient.waitForTransactionReceipt({  hash: faucetTransactionHash,});console.log("Received testnet ETH");const hash = await walletClient.sendTransaction({  to: "0x0000000000000000000000000000000000000000",  value: parseEther("0.000001"),});const txReceipt = await publicClient.waitForTransactionReceipt({  hash,});console.log(  `Transaction sent! Link: https://sepolia.basescan.org/tx/${hash}`);
```

### 4\. Putting it all together[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/viem-compatibility#4-putting-it-all-together "Direct link to 4. Putting it all together")

Here's the complete code for the example above.

main.ts

```
import { CdpClient } from "@coinbase/cdp-sdk";import dotenv from "dotenv";import { createWalletClient, http, createPublicClient, parseEther } from "viem";import { toAccount } from "viem/accounts";import { baseSepolia } from "viem/chains";dotenv.config();const cdp = new CdpClient();const account = await cdp.evm.createAccount();console.log("Created account:", account.address);const walletClient = createWalletClient({  account: toAccount(account),  chain: baseSepolia,  transport: http(),});// This is used to wait for transaction confirmationconst publicClient = createPublicClient({  chain: baseSepolia,  transport: http(),});console.log("Requesting testnet ETH from faucet...");const { transactionHash: faucetTransactionHash } = await cdp.evm.requestFaucet({  address: account.address,  network: "base-sepolia",  token: "eth",});console.log("Waiting for funds to arrive...");const faucetTxReceipt = await publicClient.waitForTransactionReceipt({  hash: faucetTransactionHash,});console.log("Received testnet ETH");const hash = await walletClient.sendTransaction({  to: "0x0000000000000000000000000000000000000000",  value: parseEther("0.000001"),});const txReceipt = await publicClient.waitForTransactionReceipt({  hash,});console.log(  `Transaction sent! Link: https://sepolia.basescan.org/tx/${hash}`);
```

What to read next[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/viem-compatibility#what-to-read-next "Direct link to What to read next")
--------------------------------------------------------------------------------------------------------------------------------

*   [**v2 Wallet Accounts**](https://docs.cdp.coinbase.com/wallet-api-v2/docs/accounts): Read more about the types of accounts and networks we support.
*   [**viem**](https://viem.sh/docs/getting-started): Learn from the official docs on how to get started developing with viem.

*   [Overview](https://docs.cdp.coinbase.com/wallet-api-v2/docs/viem-compatibility#overview)
*   [Signer Example](https://docs.cdp.coinbase.com/wallet-api-v2/docs/viem-compatibility#signer-example)
*   [Wallet Client Example](https://docs.cdp.coinbase.com/wallet-api-v2/docs/viem-compatibility#wallet-client-example)
    *   [1\. Install viem](https://docs.cdp.coinbase.com/wallet-api-v2/docs/viem-compatibility#1-install-viem)
    *   [2\. Create a Wallet Client from a CDP account](https://docs.cdp.coinbase.com/wallet-api-v2/docs/viem-compatibility#2-create-a-wallet-client-from-a-cdp-account)
    *   [3\. Send a transaction with the Wallet Client](https://docs.cdp.coinbase.com/wallet-api-v2/docs/viem-compatibility#3-send-a-transaction-with-the-wallet-client)
    *   [4\. Putting it all together](https://docs.cdp.coinbase.com/wallet-api-v2/docs/viem-compatibility#4-putting-it-all-together)
*   [What to read next](https://docs.cdp.coinbase.com/wallet-api-v2/docs/viem-compatibility#what-to-read-next)

We use cookies and similar technologies on our websites to enhance and tailor your experience, analyze our traffic, and for security and marketing. You can choose not to allow some type of cookies by clicking . For more information see our [Cookie Policy](https://www.coinbase.com/legal/cookie).