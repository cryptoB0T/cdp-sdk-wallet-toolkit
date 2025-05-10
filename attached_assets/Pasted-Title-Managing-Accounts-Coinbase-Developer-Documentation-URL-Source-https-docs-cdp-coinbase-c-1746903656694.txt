Title: Managing Accounts | Coinbase Developer Documentation

URL Source: https://docs.cdp.coinbase.com/wallet-api-v2/docs/managing-accounts

Markdown Content:
Account Names[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/managing-accounts#account-names "Direct link to Account Names")
--------------------------------------------------------------------------------------------------------------------------------

You can assign a name to an account to make it easier to access. Account names can consist of alphanumeric characters and hyphens, and must be between 2 and 36 characters long. Account names must be unique within a single CDP project for each account type (e.g., all Solana accounts).

You can assign an account name at the time of account creation, and retrieve it later using the name. The `getOrCreateAccount` method will create an account if it doesn't exist, and return the existing account if it does.

```
import { CdpClient } from "@coinbase/cdp-sdk";import dotenv from "dotenv";dotenv.config();const cdp = new CdpClient();const accountName = "my-account";// If the account doesn't exist, it will be created.let evmAccount = await cdp.evm.getOrCreateAccount({  name: accountName});console.log(`Created account with name ${evmAccount.name}.`);// If the account already exists, it will be retrieved.evmAccount = await cdp.evm.getOrCreateAccount({  name: accountName});console.log(`Retrieved account with name ${evmAccount.name}.`);
```

Listing Accounts[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/managing-accounts#listing-accounts "Direct link to Listing Accounts")
--------------------------------------------------------------------------------------------------------------------------------

You can list all accounts of a specific type in a single CDP project by calling the `listAccounts` method:

```
import { CdpClient } from "@coinbase/cdp-sdk";import dotenv from "dotenv";dotenv.config();const cdp = new CdpClient();let response = await cdp.evm.listAccounts();// Paginate through all accounts.while (true) {  for (const account of response.accounts) {    console.log('EVM account:', account.address);  }    if (!response.nextPageToken) break;    response = await cdp.evm.listAccounts({    pageToken: response.nextPageToken  });}
```