Title: Sending Transactions | Coinbase Developer Documentation

URL Source: https://docs.cdp.coinbase.com/wallet-api-v2/docs/sending-transactions

Markdown Content:
Sending Transactions | Coinbase Developer Documentation
===============

[Skip to main content](https://docs.cdp.coinbase.com/wallet-api-v2/docs/sending-transactions#__docusaurus_skipToContent_fallback)

[![Image 1: Coinbase Docs](https://docs.cdp.coinbase.com/img/logo_light.svg)](https://docs.cdp.coinbase.com/)

Docs

API reference

SDKs







We're hiring





Get help



Search or ask AI

⌘

K





Home
----

Get started
-----------

Learn
-----

CDP APIs
--------

Product APIs
------------



Wallet API

v2 Alpha



*   Introduction
    
    [Welcome](https://docs.cdp.coinbase.com/wallet-api-v2/docs/welcome)
    
    [Quickstart](https://docs.cdp.coinbase.com/wallet-api-v2/docs/quickstart)
    
    [Accounts](https://docs.cdp.coinbase.com/wallet-api-v2/docs/accounts)
    
    [Security](https://docs.cdp.coinbase.com/wallet-api-v2/docs/security)
    
    [USDC Rewards](https://docs.cdp.coinbase.com/wallet-api-v2/docs/usdc-rewards)
    
*   Using the Wallet API
    
    [Managing Accounts](https://docs.cdp.coinbase.com/wallet-api-v2/docs/managing-accounts)
    
    [Wallet Secret Rotation](https://docs.cdp.coinbase.com/wallet-api-v2/docs/update-wallet-secret)
    
*   EVM Features
    
    [Sending Transactions](https://docs.cdp.coinbase.com/wallet-api-v2/docs/sending-transactions)
    
    [Smart Accounts](https://docs.cdp.coinbase.com/wallet-api-v2/docs/smart-accounts)
    
    [viem Compatibility](https://docs.cdp.coinbase.com/wallet-api-v2/docs/viem-compatibility)
    
*   Solana Features
    
    [Batching Instructions](https://docs.cdp.coinbase.com/wallet-api-v2/docs/solana-batching-instructions)
    
*   API Reference
    
    [REST APIs ](https://docs.cdp.coinbase.com/api-v2/docs/welcome)
    
*   Support
    
    [Join CDP Discord ](https://discord.com/invite/cdp)
    

Sending Transactions
====================

The [CDP SDK's](https://github.com/coinbase/cdp-sdk) `sendTransaction` method handles **gas estimation**, **nonce management**, **transaction signing**, and **broadcasting** for EVM accounts. This means that you don't need to specify these details when you submit a transaction onchain. CDP's nonce management system ensures that the nonce is set correctly for each transaction, and the gas price is estimated to ensure that the transaction is sent at a reasonable price.

You can read more about the `sendTransaction` API in the [API Reference](https://docs.cdp.coinbase.com/api-v2/reference/sendevmtransaction).

The following code snippet demonstrates how to send a transaction using the `sendTransaction` method. You can also refer to our example code in [Typescript](https://github.com/coinbase/cdp-sdk/blob/main/examples/typescript/evm/sendManyTransactions.ts) and [Python](https://github.com/coinbase/cdp-sdk/blob/main/examples/python/evm/send_transaction.py).

Typescript
----------

Python
------

```
import dotenv from "dotenv";import { parseEther, createPublicClient, http } from "viem";import { baseSepolia } from "viem/chains";import { CdpClient } from "@coinbase/cdp-sdk";dotenv.config();/** * This script demonstrates using the new sendTransaction method to: * 1. Create a new ethereum account on CDP * 2. Request ETH from CDP faucet * 3. Sign and send a transaction in a single method call. */async function main() {  const cdp = new CdpClient();  const publicClient = createPublicClient({ chain: baseSepolia, transport: http() });  // Step 1: Create a new EVM account  const evmAccount = await cdp.evm.createAccount();  console.log("Successfully created EVM account:", evmAccount.address);  // Step 2: Request ETH from the faucet  const faucetResp = await cdp.evm.requestFaucet({    address: evmAccount.address,    network: "base-sepolia",    token: "eth",  });  // Wait for the faucet transaction to be confirmed onchain.  const faucetTxReceipt = await publicClient.waitForTransactionReceipt({    hash: faucetResp.transactionHash,  });  console.log("Successfully requested ETH from faucet:", faucetTxReceipt.transactionHash);  // Step 3: Sign and send the transaction in a single step with sendTransaction.  // The API will automatically estimate the gas price and determine the nonce.  const txResult = await cdp.evm.sendTransaction({    address: evmAccount.address,    network: "base-sepolia",    transaction: {      to: "0x4252e0c9A3da5A2700e7d91cb50aEf522D0C6Fe8", // recipient address      value: parseEther("0.000001"), // sending 0.000001 ETH    },  });  console.log("Transaction sent successfully!");  console.log(    `Transaction explorer link: https://sepolia.basescan.org/tx/${txResult.transactionHash}`,  );  await publicClient.waitForTransactionReceipt({ hash: txResult.transactionHash });  console.log("Transaction confirmed!");}main().catch(console.error);
```

```
import asynciofrom web3 import Web3from cdp import CdpClientfrom cdp.evm_transaction_types import TransactionRequestEIP1559import dotenvdotenv.load_dotenv()w3 = Web3(Web3.HTTPProvider("https://sepolia.base.org"))# This script demonstrates using the send_transaction API to:# 1. Create an EVM account# 2. Request ETH from the faucet# 3. Sign and send a transaction in a single method call.async def main():    async with CdpClient() as cdp:        # Step 1: Create an EVM account        account = await cdp.evm.create_account()        print(f"Created account: {account.address}")        # Step 2: Request ETH from the faucet        faucet_hash = await cdp.evm.request_faucet(            address=account.address, network="base-sepolia", token="eth"        )        w3.eth.wait_for_transaction_receipt(faucet_hash)        print(f"Received funds from faucet for address: {account.address}")        # Step 3: Sign and send the transaction in a single step with send_transaction.        # The API will automatically estimate the gas price and determine the nonce.        tx_hash = await cdp.evm.send_transaction(            address=account.address,            transaction=TransactionRequestEIP1559(                to="0x0000000000000000000000000000000000000000",                value=w3.to_wei(0.000001, "ether"),            ),            network="base-sepolia",        )        print(f"Transaction sent! Hash: {tx_hash}")        print("Waiting for transaction confirmation...")        tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)        status = "Success" if tx_receipt.status == 1 else "Failed"        print(f"Transaction confirmed in block {tx_receipt.blockNumber}")        print(f"Transaction status: {status}")asyncio.run(main())
```

Last updated on **May 7, 2025**

Was this page helpful?



Yes



No



[Get help on Discord](https://discord.com/invite/cdp)



[Request a feature](https://coinbase-developer-platform.canny.io/cdp)

We use cookies and similar technologies on our websites to enhance and tailor your experience, analyze our traffic, and for security and marketing. You can choose not to allow some type of cookies by clicking Manage Settings. For more information see our [Cookie Policy](https://www.coinbase.com/legal/cookie).

Manage settings

Accept all