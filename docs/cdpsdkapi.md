<source type="web_documentation" url="https://coinbase.github.io/cdp-sdk/typescript/">
<page url="https://coinbase.github.io/cdp-sdk/typescript/">
Preparing search index...
The search index is not available
Documentation
Documentation
Coinbase Developer Platform (CDP) TypeScript SDK
Table of Contents
CDP SDK
Documentation
Installation
API Keys
Usage
Policy Management
Authentication tools
Error Reporting
License
Support
Security
FAQ
Tip
If you're looking to contribute to the SDK, please see the
Contributing Guide
.
CDP SDK
This module contains the TypeScript CDP SDK, which is a library that provides a client for interacting with the
Coinbase Developer Platform (CDP)
. It includes a CDP Client for interacting with EVM and Solana APIs to create accounts and send transactions, policy APIs to govern transaction permissions, as well as authentication tools for interacting directly with the CDP APIs.
Documentation
CDP SDK has
auto-generated docs for the Typescript SDK
.
Further documentation is also available on the CDP docs website:
Wallet API v2
API Reference
Installation
npm
install
@coinbase/cdp-sdk
Copy
API Keys
To start,
create a CDP API Key
. Save the
API Key ID
and
API Key Secret
for use in the SDK. You will also need to create a wallet secret in the Portal to sign transactions.
Usage
Initialization
Load client config from shell
One option is to export your CDP API Key and Wallet Secret as environment variables:
export
CDP_API_KEY_ID
=
"YOUR_API_KEY_ID"
export
CDP_API_KEY_SECRET
=
"YOUR_API_KEY_SECRET"
export
CDP_WALLET_SECRET
=
"YOUR_WALLET_SECRET"
Copy
Then, initialize the client:
import
{
CdpClient
}
from
"@coinbase/cdp-sdk"
;
const
cdp
=
new
CdpClient
();
Copy
Load client config from
.env
file
Another option is to save your CDP API Key and Wallet Secret in a
.env
file:
touch
.env
echo
"CDP_API_KEY_ID=YOUR_API_KEY_ID"
&gt;&gt;
.env
echo
"CDP_API_KEY_SECRET=YOUR_API_KEY_SECRET"
&gt;&gt;
.env
echo
"CDP_WALLET_SECRET=YOUR_WALLET_SECRET"
&gt;&gt;
.env
Copy
Then, load the client config from the
.env
file:
import
{
CdpClient
}
from
"@coinbase/cdp-sdk"
;
import
dotenv
from
"dotenv"
;
dotenv
.
config
();
const
cdp
=
new
CdpClient
();
Copy
Pass the API Key and Wallet Secret to the client
Another option is to directly pass the API Key and Wallet Secret to the client:
const
cdp
=
new
CdpClient
({
apiKeyId:
"YOUR_API_KEY_ID"
,
apiKeySecret:
"YOUR_API_KEY_SECRET"
,
walletSecret:
"YOUR_WALLET_SECRET"
,
});
Copy
Creating EVM or Solana accounts
Create an EVM account as follows:
const
account
=
await
cdp
.
evm
.
createAccount
();
Copy
Create a Solana account as follows:
const
account
=
await
cdp
.
solana
.
createAccount
();
Copy
Get or Create an EVM account as follows:
const
account
=
await
cdp
.
evm
.
getOrCreateAccount
({
name:
"Account1"
,
});
Copy
Get or Create a Solana account as follows:
const
account
=
await
cdp
.
solana
.
getOrCreateAccount
({
name:
"Account1"
,
});
Copy
Updating EVM or Solana accounts
Update an EVM account as follows:
const
account
=
await
cdp
.
evm
.
updateAccount
({
addresss:
account
.
address
,
update:
{
name:
"Updated name"
,
accountPolicy:
"1622d4b7-9d60-44a2-9a6a-e9bbb167e412"
}
});
Copy
Update a Solana account as follows:
const
account
=
await
cdp
.
solana
.
updateAccount
({
addresss:
account
.
address
,
update:
{
name:
"Updated name"
,
accountPolicy:
"1622d4b7-9d60-44a2-9a6a-e9bbb167e412"
}
});
Copy
Testnet faucet
You can use the faucet function to request testnet ETH or SOL from the CDP.
Request testnet ETH as follows:
const
faucetResp
=
await
cdp
.
evm
.
requestFaucet
({
address:
evmAccount
.
address
,
network:
"base-sepolia"
,
token:
"eth"
,
});
Copy
Request testnet SOL as follows:
const
faucetResp
=
await
cdp
.
solana
.
requestFaucet
({
address:
fromAddress
,
token:
"sol"
,
});
Copy
Sending transactions
EVM
You can use CDP SDK to send transactions on EVM networks.
import
{
CdpClient
}
from
"@coinbase/cdp-sdk"
;
import
{
parseEther
,
createPublicClient
,
http
}
from
"viem"
;
import
{
baseSepolia
}
from
"viem/chains"
;
const
publicClient
=
createPublicClient
({
chain:
baseSepolia
,
transport:
http
(),
});
const
cdp
=
new
CdpClient
();
const
account
=
await
cdp
.
evm
.
createAccount
();
const
faucetResp
=
await
cdp
.
evm
.
requestFaucet
({
address:
account
.
address
,
network:
"base-sepolia"
,
token:
"eth"
,
});
const
faucetTxReceipt
=
await
publicClient
.
waitForTransactionReceipt
({
hash:
faucetResp
.
transactionHash
,
});
const
{
transactionHash
} =
await
cdp
.
evm
.
sendTransaction
({
address:
account
.
address
,
network:
"base-sepolia"
,
transaction:
{
to:
"0x4252e0c9A3da5A2700e7d91cb50aEf522D0C6Fe8"
,
value:
parseEther
(
"0.000001"
),
},
});
await
publicClient
.
waitForTransactionReceipt
({
hash:
transactionHash
});
console
.
log
(
`Transaction confirmed! Explorer link: https://sepolia.basescan.org/tx/
${
transactionHash
}
`
,
);
Copy
CDP SDK is fully viem-compatible, so you can optionally use a
walletClient
to send transactions.
import
{
CdpClient
}
from
"@coinbase/cdp-sdk"
;
import
{
parseEther
,
createPublicClient
,
http
,
createWalletClient
,
toAccount
}
from
"viem"
;
import
{
baseSepolia
}
from
"viem/chains"
;
const
publicClient
=
createPublicClient
({
chain:
baseSepolia
,
transport:
http
(),
});
const
cdp
=
new
CdpClient
();
const
account
=
await
cdp
.
evm
.
createAccount
();
const
faucetResp
=
await
cdp
.
evm
.
requestFaucet
({
address:
account
.
address
,
network:
"base-sepolia"
,
token:
"eth"
,
});
const
faucetTxReceipt
=
await
publicClient
.
waitForTransactionReceipt
({
hash:
faucetResp
.
transactionHash
,
});
const
walletClient
=
createWalletClient
({
account:
toAccount
(
serverAccount
),
chain:
baseSepolia
,
transport:
http
(),
});
// Step 3: Sign the transaction with CDP and broadcast it using the wallet client.
const
hash
=
await
walletClient
.
sendTransaction
({
to:
"0x4252e0c9A3da5A2700e7d91cb50aEf522D0C6Fe8"
,
value:
parseEther
(
"0.000001"
),
});
console
.
log
(
`Transaction confirmed! Explorer link: https://sepolia.basescan.org/tx/
${
hash
}
`
);
Copy
Solana
For Solana, we recommend using the
@solana/web3.js
library to send transactions. See the
examples
.
EVM Smart Accounts
For EVM, we support Smart Accounts which are account-abstraction (ERC-4337) accounts. Currently there is only support for Base Sepolia and Base Mainnet for Smart Accounts.
Create an EVM account and a smart account as follows:
const
evmAccount
=
await
cdp
.
evm
.
createAccount
();
const
smartAccount
=
await
cdp
.
evm
.
createSmartAccount
({
owner:
evmAccount
,
});
Copy
Sending User Operations
const
userOperation
=
await
cdp
.
evm
.
sendUserOperation
({
smartAccount:
smartAccount
,
network:
"base-sepolia"
,
calls:
[
{
to:
"0x0000000000000000000000000000000000000000"
,
value:
parseEther
(
"0.000001"
),
data:
"0x"
,
},
],
});
Copy
In Base Sepolia, all user operations are gasless by default. If you'd like to specify a different paymaster, you can do so as follows:
const
userOperation
=
await
cdp
.
sendUserOperation
({
smartAccount:
smartAccount
,
network:
"base-sepolia"
,
calls:
[
{
to:
"0x0000000000000000000000000000000000000000"
,
value:
parseEther
(
"0"
),
data:
"0x"
,
},
],
paymasterUrl:
"https://some-paymaster-url.com"
,
});
Copy
Transferring tokens
For complete examples, check out
transfer.ts
and
transferWithSmartWallet.ts
.
You can transfer tokens between accounts using the
transfer
function:
const
sender
=
await
cdp
.
evm
.
createAccount
({
name:
"Sender"
});
const
{
status
} =
await
sender
.
transfer
({
to:
"0x9F663335Cd6Ad02a37B633602E98866CF944124d"
,
amount:
"0.01"
,
token:
"usdc"
,
network:
"base-sepolia"
,
});
Copy
Smart Accounts also have a
transfer
function:
const
sender
=
await
cdp
.
evm
.
createSmartAccount
({
owner:
privateKeyToAccount
(
generatePrivateKey
()),
});
console
.
log
(
"Created smart account"
,
sender
);
const
{
status
} =
await
sender
.
transfer
({
to:
"0x9F663335Cd6Ad02a37B633602E98866CF944124d"
,
amount:
"0.01"
,
token:
"usdc"
,
network:
"base-sepolia"
,
});
Copy
Using Smart Accounts, you can also specify a paymaster URL and wait options:
const
{
status
} =
await
sender
.
transfer
({
to:
"0x9F663335Cd6Ad02a37B633602E98866CF944124d"
,
amount:
"0.01"
,
token:
"usdc"
,
network:
"base-sepolia"
,
paymasterUrl:
"https://some-paymaster-url.com"
,
waitOptions:
{
timeout:
30
,
interval:
2
,
},
});
Copy
If you pass a decimal amount in a string, the SDK will parse it into a bigint based on the token's decimals. You can also pass a bigint directly:
const
{
status
} =
await
sender
.
transfer
({
to:
"0x9F663335Cd6Ad02a37B633602E98866CF944124d"
,
amount:
10000
n
,
// equivalent to 0.01 usdc
token:
"usdc"
,
network:
"base-sepolia"
,
});
Copy
You can pass
usdc
or
eth
as the token to transfer, or you can pass a contract address directly:
const
{
status
} =
await
sender
.
transfer
({
to:
"0x9F663335Cd6Ad02a37B633602E98866CF944124d"
,
amount:
"0.000001"
,
token:
"0x4200000000000000000000000000000000000006"
,
// WETH on Base Sepolia
network:
"base-sepolia"
,
});
Copy
You can also pass another account as the
to
parameter:
const
sender
=
await
cdp
.
evm
.
createAccount
({
name:
"Sender"
});
const
receiver
=
await
cdp
.
evm
.
createAccount
({
name:
"Receiver"
});
const
{
status
} =
await
sender
.
transfer
({
to:
receiver
,
amount:
"0.01"
,
token:
"usdc"
,
network:
"base-sepolia"
,
});
Copy
You can also pass wait options to the
transfer
function:
const
{
status
} =
await
sender
.
transfer
({
to:
receiver
,
amount:
"0.01"
,
token:
"usdc"
,
network:
"base-sepolia"
,
waitOptions:
{
timeout:
30
,
interval:
2
,
},
});
Copy
Account Actions
Account objects have actions that can be used to interact with the account. These can be used in place of the
cdp
client.
EVM account actions
Here are some examples for actions on EVM accounts.
For example, instead of:
const
balances
=
await
cdp
.
evm
.
listTokenBalances
({
address:
account
.
address
,
network:
"base-sepolia"
,
});
Copy
You can use the
listTokenBalances
action:
const
account
=
await
cdp
.
evm
.
createAccount
();
const
balances
=
await
account
.
listTokenBalances
({
network:
"base-sepolia"
});
Copy
EvmAccount supports the following actions:
listTokenBalances
requestFaucet
signTransaction
sendTransaction
transfer
EvmSmartAccount supports the following actions:
listTokenBalances
requestFaucet
sendUserOperation
waitForUserOperation
getUserOperation
transfer
Solana account actions
Here are some examples for actions on Solana accounts.
const
balances
=
await
cdp
.
solana
.
signMessage
({
address:
account
.
address
,
message:
"Hello, world!"
,
});
Copy
You can use the
signMessage
action:
const
account
=
await
cdp
.
solana
.
createAccount
();
const
{
signature
} =
await
account
.
signMessage
({
message:
"Hello, world!"
});
Copy
SolanaAccount supports the following actions:
requestFaucet
signMessage
signTransaction
Policy Management
You can use the policies SDK to manage sets of rules that govern the behavior of accounts and projects, such as enforce allowlists and denylists.
Create a Project-level policy that applies to all accounts
This policy will accept any account sending less than a specific amount of ETH to a specific address.
const
policy
=
await
cdp
.
policies
.
createPolicy
({
policy:
{
scope:
'project'
,
description:
'Project-wide Allowlist Policy'
,
rules:
[
{
action:
'accept'
,
operation:
'signEvmTransaction'
,
criteria:
[
{
type:
'ethValue'
,
ethValue:
'1000000000000000000'
,
operator:
'&lt;='
},
{
type:
'evmAddress'
,
addresses:
[
"0x000000000000000000000000000000000000dEaD"
],
operator:
'in'
}
]
}
]
}
});
Copy
Create an Account-level policy
This policy will accept any transaction with a value less than or equal to 1 ETH to a specific address.
const
policy
=
await
cdp
.
policies
.
createPolicy
({
policy:
{
scope:
'account'
,
description:
'Account Allowlist Policy'
,
rules:
[
{
action:
'accept'
,
operation:
'signEvmTransaction'
,
criteria:
[
{
type:
'ethValue'
,
ethValue:
'1000000000000000000'
,
operator:
'&lt;='
},
{
type:
'evmAddress'
,
addresses:
[
"0x000000000000000000000000000000000000dEaD"
],
operator:
'in'
}
]
}
]
}
});
Copy
Create a Solana Allowlist Policy
const
policy
=
await
cdp
.
policies
.
createPolicy
({
policy:
{
scope:
'account'
,
description:
'Account Allowlist Policy'
,
rules:
[
{
action:
'accept'
,
operation:
'signSolTransaction'
,
criteria:
[
{
type:
'solAddress'
,
addresses:
[
"DtdSSG8ZJRZVv5Jx7K1MeWp7Zxcu19GD5wQRGRpQ9uMF"
],
operator:
'in'
}
]
}
]
}
});
Copy
List Policies
You can filter by account:
const
policy
=
await
cdp
.
policies
.
listPolicies
({
scope:
'account'
});
Copy
You can also filter by project:
const
policy
=
await
cdp
.
policies
.
listPolicies
({
scope:
'project'
});
Copy
Retrieve a Policy
const
policy
=
await
cdp
.
policies
.
getPolicyById
({
id:
'__POLICY_ID__'
});
Copy
Update a Policy
This policy will update an existing policy to accept transactions to any address except one.
const
policy
=
await
cdp
.
policies
.
updatePolicy
({
id:
'__POLICY_ID__'
,
policy:
{
description:
'Updated Account Denylist Policy'
,
rules:
[
{
action:
'accept'
,
operation:
'signEvmTransaction'
,
criteria:
[
{
type:
'evmAddress'
,
addresses:
[
"0x000000000000000000000000000000000000dEaD"
],
operator:
'not in'
}
]
}
]
}
});
Copy
Delete a Policy
Warning
Attempting to delete an account-level policy in-use by at least one account will fail.
const
policy
=
await
cdp
.
policies
.
deletePolicy
({
id:
'__POLICY_ID__'
});
Copy
Validate a Policy
If you're integrating policy editing into your application, you may find it useful to validate policies ahead of time to provide a user with feedback. The
CreatePolicyBodySchema
and
UpdatePolicyBodySchema
can be used to get actionable structured information about any issues with a policy. Read more about
handling ZodErrors
.
import
{
CreatePolicyBodySchema
,
UpdatePolicyBodySchema
}
from
"@coinbase/cdp-sdk"
;
// Validate a new Policy with many issues, will throw a ZodError with actionable validation errors
try
{
CreatePolicyBodySchema
.
parse
({
description:
'Bad description with !#@ characters, also is wayyyyy toooooo long!!'
,
rules:
[
{
action:
'acept'
,
operation:
'unknownOperation'
,
criteria:
[
{
type:
'ethValue'
,
ethValue:
'not a number'
,
operator:
'&lt;='
},
{
type:
'evmAddress'
,
addresses:
[
"not an address"
],
operator:
'in'
},
{
type:
'evmAddress'
,
addresses:
[
"not an address"
],
operator:
'invalid operator'
}
]
},
]
})
}
catch
(
e
) {
console
.
error
(
e
)
}
Copy
Authentication tools
This SDK also contains simple tools for authenticating REST API requests to the
Coinbase Developer Platform (CDP)
. See the
Auth README
for more details.
Error Reporting
This SDK contains error reporting functionality that sends error events to the CDP. If you would like to disable this behavior, you can set the
DISABLE_CDP_ERROR_REPORTING
environment variable to
true
.
DISABLE_CDP_ERROR_REPORTING
=
true
Copy
License
This project is licensed under the MIT License - see the
LICENSE
file for details.
Support
For feature requests, feedback, or questions, please reach out to us in the
#cdp-sdk
channel of the
Coinbase Developer Platform Discord
.
API Reference
SDK Docs
GitHub Issues
Security
If you discover a security vulnerability within this SDK, please see our
Security Policy
for disclosure information.
FAQ
Common errors and their solutions.
AggregateError [ETIMEDOUT]
This is an issue in Node.js itself:
https://github.com/nodejs/node/issues/54359
. While
the fix
is implemented, the workaround is to set the environment variable:
export
NODE_OPTIONS
=
"--network-family-autoselection-attempt-timeout=500"
Copy
Error [ERR_REQUIRE_ESM]: require() of ES modules is not supported.
Use Node v20.19.0 or higher. CDP SDK depends on
jose
v6, which ships only ESM. Jose supports CJS style imports in Node.js versions where the require(esm) feature is enabled by default (^20.19.0 || ^22.12.0 || &gt;= 23.0.0).
See here for more info
.
Jest encountered an unexpected token
If you're using Jest and see an error like this:
Details
:
/Users/
.../
node_modules
/
jose
/
dist
/
webapi
/
index
.
js
:
1
({
"Object.&lt;anonymous&gt;"
:
function
(
module
,
exports
,
require
,
__dirname
,
__filename
,
jest
){
export
{
compactDecrypt
}
from
'./jwe/compact/decrypt.js'
;
^^^^^^
SyntaxError
:
Unexpected
token
'export'
Copy
Add a file called
jest.setup.ts
next to your
jest.config
file with the following content:
jest
.
mock
(
"jose"
, ()
=&gt;
{});
Copy
Then, add the following line to your
jest.config
file:
setupFilesAfterEnv
: [
"&lt;rootDir&gt;/jest.setup.ts"
],
Copy
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Coinbase
Developer
Platform (CDP)
Type
Script SDK
Table of
Contents
CDP SDK
Documentation
Installation
API
Keys
Usage
Initialization
Load client config from shell
Load client config from .env file
Pass the API
Key and
Wallet
Secret to the client
Creating EVM or
Solana accounts
Create an EVM account as follows:
Create a
Solana account as follows:
Get or
Create an EVM account as follows:
Get or
Create a
Solana account as follows:
Updating EVM or
Solana accounts
Update an EVM account as follows:
Update a
Solana account as follows:
Testnet faucet
Request testnet ETH as follows:
Request testnet SOL as follows:
Sending transactions
EVM
Solana
EVM
Smart
Accounts
Create an EVM account and a smart account as follows:
Sending
User
Operations
In
Base
Sepolia, all user operations are gasless by default.
If you'd like to specify a different paymaster, you can do so as follows:
Transferring tokens
Account
Actions
EVM account actions
Solana account actions
Policy
Management
Create a
Project-
level policy that applies to all accounts
Create an
Account-
level policy
Create a
Solana
Allowlist
Policy
List
Policies
Retrieve a
Policy
Update a
Policy
Delete a
Policy
Validate a
Policy
Authentication tools
Error
Reporting
License
Support
Security
FAQ
Aggregate
Error [ETIMEDOUT]
Error [ERR_
REQUIRE_
ESM]: require() of ES modules is not supported.
Jest encountered an unexpected token
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/index.html">
Preparing search index...
The search index is not available
Documentation
Documentation
Coinbase Developer Platform (CDP) TypeScript SDK
Table of Contents
CDP SDK
Documentation
Installation
API Keys
Usage
Policy Management
Authentication tools
Error Reporting
License
Support
Security
FAQ
Tip
If you're looking to contribute to the SDK, please see the
Contributing Guide
.
CDP SDK
This module contains the TypeScript CDP SDK, which is a library that provides a client for interacting with the
Coinbase Developer Platform (CDP)
. It includes a CDP Client for interacting with EVM and Solana APIs to create accounts and send transactions, policy APIs to govern transaction permissions, as well as authentication tools for interacting directly with the CDP APIs.
Documentation
CDP SDK has
auto-generated docs for the Typescript SDK
.
Further documentation is also available on the CDP docs website:
Wallet API v2
API Reference
Installation
npm
install
@coinbase/cdp-sdk
Copy
API Keys
To start,
create a CDP API Key
. Save the
API Key ID
and
API Key Secret
for use in the SDK. You will also need to create a wallet secret in the Portal to sign transactions.
Usage
Initialization
Load client config from shell
One option is to export your CDP API Key and Wallet Secret as environment variables:
export
CDP_API_KEY_ID
=
"YOUR_API_KEY_ID"
export
CDP_API_KEY_SECRET
=
"YOUR_API_KEY_SECRET"
export
CDP_WALLET_SECRET
=
"YOUR_WALLET_SECRET"
Copy
Then, initialize the client:
import
{
CdpClient
}
from
"@coinbase/cdp-sdk"
;
const
cdp
=
new
CdpClient
();
Copy
Load client config from
.env
file
Another option is to save your CDP API Key and Wallet Secret in a
.env
file:
touch
.env
echo
"CDP_API_KEY_ID=YOUR_API_KEY_ID"
&gt;&gt;
.env
echo
"CDP_API_KEY_SECRET=YOUR_API_KEY_SECRET"
&gt;&gt;
.env
echo
"CDP_WALLET_SECRET=YOUR_WALLET_SECRET"
&gt;&gt;
.env
Copy
Then, load the client config from the
.env
file:
import
{
CdpClient
}
from
"@coinbase/cdp-sdk"
;
import
dotenv
from
"dotenv"
;
dotenv
.
config
();
const
cdp
=
new
CdpClient
();
Copy
Pass the API Key and Wallet Secret to the client
Another option is to directly pass the API Key and Wallet Secret to the client:
const
cdp
=
new
CdpClient
({
apiKeyId:
"YOUR_API_KEY_ID"
,
apiKeySecret:
"YOUR_API_KEY_SECRET"
,
walletSecret:
"YOUR_WALLET_SECRET"
,
});
Copy
Creating EVM or Solana accounts
Create an EVM account as follows:
const
account
=
await
cdp
.
evm
.
createAccount
();
Copy
Create a Solana account as follows:
const
account
=
await
cdp
.
solana
.
createAccount
();
Copy
Get or Create an EVM account as follows:
const
account
=
await
cdp
.
evm
.
getOrCreateAccount
({
name:
"Account1"
,
});
Copy
Get or Create a Solana account as follows:
const
account
=
await
cdp
.
solana
.
getOrCreateAccount
({
name:
"Account1"
,
});
Copy
Updating EVM or Solana accounts
Update an EVM account as follows:
const
account
=
await
cdp
.
evm
.
updateAccount
({
addresss:
account
.
address
,
update:
{
name:
"Updated name"
,
accountPolicy:
"1622d4b7-9d60-44a2-9a6a-e9bbb167e412"
}
});
Copy
Update a Solana account as follows:
const
account
=
await
cdp
.
solana
.
updateAccount
({
addresss:
account
.
address
,
update:
{
name:
"Updated name"
,
accountPolicy:
"1622d4b7-9d60-44a2-9a6a-e9bbb167e412"
}
});
Copy
Testnet faucet
You can use the faucet function to request testnet ETH or SOL from the CDP.
Request testnet ETH as follows:
const
faucetResp
=
await
cdp
.
evm
.
requestFaucet
({
address:
evmAccount
.
address
,
network:
"base-sepolia"
,
token:
"eth"
,
});
Copy
Request testnet SOL as follows:
const
faucetResp
=
await
cdp
.
solana
.
requestFaucet
({
address:
fromAddress
,
token:
"sol"
,
});
Copy
Sending transactions
EVM
You can use CDP SDK to send transactions on EVM networks.
import
{
CdpClient
}
from
"@coinbase/cdp-sdk"
;
import
{
parseEther
,
createPublicClient
,
http
}
from
"viem"
;
import
{
baseSepolia
}
from
"viem/chains"
;
const
publicClient
=
createPublicClient
({
chain:
baseSepolia
,
transport:
http
(),
});
const
cdp
=
new
CdpClient
();
const
account
=
await
cdp
.
evm
.
createAccount
();
const
faucetResp
=
await
cdp
.
evm
.
requestFaucet
({
address:
account
.
address
,
network:
"base-sepolia"
,
token:
"eth"
,
});
const
faucetTxReceipt
=
await
publicClient
.
waitForTransactionReceipt
({
hash:
faucetResp
.
transactionHash
,
});
const
{
transactionHash
} =
await
cdp
.
evm
.
sendTransaction
({
address:
account
.
address
,
network:
"base-sepolia"
,
transaction:
{
to:
"0x4252e0c9A3da5A2700e7d91cb50aEf522D0C6Fe8"
,
value:
parseEther
(
"0.000001"
),
},
});
await
publicClient
.
waitForTransactionReceipt
({
hash:
transactionHash
});
console
.
log
(
`Transaction confirmed! Explorer link: https://sepolia.basescan.org/tx/
${
transactionHash
}
`
,
);
Copy
CDP SDK is fully viem-compatible, so you can optionally use a
walletClient
to send transactions.
import
{
CdpClient
}
from
"@coinbase/cdp-sdk"
;
import
{
parseEther
,
createPublicClient
,
http
,
createWalletClient
,
toAccount
}
from
"viem"
;
import
{
baseSepolia
}
from
"viem/chains"
;
const
publicClient
=
createPublicClient
({
chain:
baseSepolia
,
transport:
http
(),
});
const
cdp
=
new
CdpClient
();
const
account
=
await
cdp
.
evm
.
createAccount
();
const
faucetResp
=
await
cdp
.
evm
.
requestFaucet
({
address:
account
.
address
,
network:
"base-sepolia"
,
token:
"eth"
,
});
const
faucetTxReceipt
=
await
publicClient
.
waitForTransactionReceipt
({
hash:
faucetResp
.
transactionHash
,
});
const
walletClient
=
createWalletClient
({
account:
toAccount
(
serverAccount
),
chain:
baseSepolia
,
transport:
http
(),
});
// Step 3: Sign the transaction with CDP and broadcast it using the wallet client.
const
hash
=
await
walletClient
.
sendTransaction
({
to:
"0x4252e0c9A3da5A2700e7d91cb50aEf522D0C6Fe8"
,
value:
parseEther
(
"0.000001"
),
});
console
.
log
(
`Transaction confirmed! Explorer link: https://sepolia.basescan.org/tx/
${
hash
}
`
);
Copy
Solana
For Solana, we recommend using the
@solana/web3.js
library to send transactions. See the
examples
.
EVM Smart Accounts
For EVM, we support Smart Accounts which are account-abstraction (ERC-4337) accounts. Currently there is only support for Base Sepolia and Base Mainnet for Smart Accounts.
Create an EVM account and a smart account as follows:
const
evmAccount
=
await
cdp
.
evm
.
createAccount
();
const
smartAccount
=
await
cdp
.
evm
.
createSmartAccount
({
owner:
evmAccount
,
});
Copy
Sending User Operations
const
userOperation
=
await
cdp
.
evm
.
sendUserOperation
({
smartAccount:
smartAccount
,
network:
"base-sepolia"
,
calls:
[
{
to:
"0x0000000000000000000000000000000000000000"
,
value:
parseEther
(
"0.000001"
),
data:
"0x"
,
},
],
});
Copy
In Base Sepolia, all user operations are gasless by default. If you'd like to specify a different paymaster, you can do so as follows:
const
userOperation
=
await
cdp
.
sendUserOperation
({
smartAccount:
smartAccount
,
network:
"base-sepolia"
,
calls:
[
{
to:
"0x0000000000000000000000000000000000000000"
,
value:
parseEther
(
"0"
),
data:
"0x"
,
},
],
paymasterUrl:
"https://some-paymaster-url.com"
,
});
Copy
Transferring tokens
For complete examples, check out
transfer.ts
and
transferWithSmartWallet.ts
.
You can transfer tokens between accounts using the
transfer
function:
const
sender
=
await
cdp
.
evm
.
createAccount
({
name:
"Sender"
});
const
{
status
} =
await
sender
.
transfer
({
to:
"0x9F663335Cd6Ad02a37B633602E98866CF944124d"
,
amount:
"0.01"
,
token:
"usdc"
,
network:
"base-sepolia"
,
});
Copy
Smart Accounts also have a
transfer
function:
const
sender
=
await
cdp
.
evm
.
createSmartAccount
({
owner:
privateKeyToAccount
(
generatePrivateKey
()),
});
console
.
log
(
"Created smart account"
,
sender
);
const
{
status
} =
await
sender
.
transfer
({
to:
"0x9F663335Cd6Ad02a37B633602E98866CF944124d"
,
amount:
"0.01"
,
token:
"usdc"
,
network:
"base-sepolia"
,
});
Copy
Using Smart Accounts, you can also specify a paymaster URL and wait options:
const
{
status
} =
await
sender
.
transfer
({
to:
"0x9F663335Cd6Ad02a37B633602E98866CF944124d"
,
amount:
"0.01"
,
token:
"usdc"
,
network:
"base-sepolia"
,
paymasterUrl:
"https://some-paymaster-url.com"
,
waitOptions:
{
timeout:
30
,
interval:
2
,
},
});
Copy
If you pass a decimal amount in a string, the SDK will parse it into a bigint based on the token's decimals. You can also pass a bigint directly:
const
{
status
} =
await
sender
.
transfer
({
to:
"0x9F663335Cd6Ad02a37B633602E98866CF944124d"
,
amount:
10000
n
,
// equivalent to 0.01 usdc
token:
"usdc"
,
network:
"base-sepolia"
,
});
Copy
You can pass
usdc
or
eth
as the token to transfer, or you can pass a contract address directly:
const
{
status
} =
await
sender
.
transfer
({
to:
"0x9F663335Cd6Ad02a37B633602E98866CF944124d"
,
amount:
"0.000001"
,
token:
"0x4200000000000000000000000000000000000006"
,
// WETH on Base Sepolia
network:
"base-sepolia"
,
});
Copy
You can also pass another account as the
to
parameter:
const
sender
=
await
cdp
.
evm
.
createAccount
({
name:
"Sender"
});
const
receiver
=
await
cdp
.
evm
.
createAccount
({
name:
"Receiver"
});
const
{
status
} =
await
sender
.
transfer
({
to:
receiver
,
amount:
"0.01"
,
token:
"usdc"
,
network:
"base-sepolia"
,
});
Copy
You can also pass wait options to the
transfer
function:
const
{
status
} =
await
sender
.
transfer
({
to:
receiver
,
amount:
"0.01"
,
token:
"usdc"
,
network:
"base-sepolia"
,
waitOptions:
{
timeout:
30
,
interval:
2
,
},
});
Copy
Account Actions
Account objects have actions that can be used to interact with the account. These can be used in place of the
cdp
client.
EVM account actions
Here are some examples for actions on EVM accounts.
For example, instead of:
const
balances
=
await
cdp
.
evm
.
listTokenBalances
({
address:
account
.
address
,
network:
"base-sepolia"
,
});
Copy
You can use the
listTokenBalances
action:
const
account
=
await
cdp
.
evm
.
createAccount
();
const
balances
=
await
account
.
listTokenBalances
({
network:
"base-sepolia"
});
Copy
EvmAccount supports the following actions:
listTokenBalances
requestFaucet
signTransaction
sendTransaction
transfer
EvmSmartAccount supports the following actions:
listTokenBalances
requestFaucet
sendUserOperation
waitForUserOperation
getUserOperation
transfer
Solana account actions
Here are some examples for actions on Solana accounts.
const
balances
=
await
cdp
.
solana
.
signMessage
({
address:
account
.
address
,
message:
"Hello, world!"
,
});
Copy
You can use the
signMessage
action:
const
account
=
await
cdp
.
solana
.
createAccount
();
const
{
signature
} =
await
account
.
signMessage
({
message:
"Hello, world!"
});
Copy
SolanaAccount supports the following actions:
requestFaucet
signMessage
signTransaction
Policy Management
You can use the policies SDK to manage sets of rules that govern the behavior of accounts and projects, such as enforce allowlists and denylists.
Create a Project-level policy that applies to all accounts
This policy will accept any account sending less than a specific amount of ETH to a specific address.
const
policy
=
await
cdp
.
policies
.
createPolicy
({
policy:
{
scope:
'project'
,
description:
'Project-wide Allowlist Policy'
,
rules:
[
{
action:
'accept'
,
operation:
'signEvmTransaction'
,
criteria:
[
{
type:
'ethValue'
,
ethValue:
'1000000000000000000'
,
operator:
'&lt;='
},
{
type:
'evmAddress'
,
addresses:
[
"0x000000000000000000000000000000000000dEaD"
],
operator:
'in'
}
]
}
]
}
});
Copy
Create an Account-level policy
This policy will accept any transaction with a value less than or equal to 1 ETH to a specific address.
const
policy
=
await
cdp
.
policies
.
createPolicy
({
policy:
{
scope:
'account'
,
description:
'Account Allowlist Policy'
,
rules:
[
{
action:
'accept'
,
operation:
'signEvmTransaction'
,
criteria:
[
{
type:
'ethValue'
,
ethValue:
'1000000000000000000'
,
operator:
'&lt;='
},
{
type:
'evmAddress'
,
addresses:
[
"0x000000000000000000000000000000000000dEaD"
],
operator:
'in'
}
]
}
]
}
});
Copy
Create a Solana Allowlist Policy
const
policy
=
await
cdp
.
policies
.
createPolicy
({
policy:
{
scope:
'account'
,
description:
'Account Allowlist Policy'
,
rules:
[
{
action:
'accept'
,
operation:
'signSolTransaction'
,
criteria:
[
{
type:
'solAddress'
,
addresses:
[
"DtdSSG8ZJRZVv5Jx7K1MeWp7Zxcu19GD5wQRGRpQ9uMF"
],
operator:
'in'
}
]
}
]
}
});
Copy
List Policies
You can filter by account:
const
policy
=
await
cdp
.
policies
.
listPolicies
({
scope:
'account'
});
Copy
You can also filter by project:
const
policy
=
await
cdp
.
policies
.
listPolicies
({
scope:
'project'
});
Copy
Retrieve a Policy
const
policy
=
await
cdp
.
policies
.
getPolicyById
({
id:
'__POLICY_ID__'
});
Copy
Update a Policy
This policy will update an existing policy to accept transactions to any address except one.
const
policy
=
await
cdp
.
policies
.
updatePolicy
({
id:
'__POLICY_ID__'
,
policy:
{
description:
'Updated Account Denylist Policy'
,
rules:
[
{
action:
'accept'
,
operation:
'signEvmTransaction'
,
criteria:
[
{
type:
'evmAddress'
,
addresses:
[
"0x000000000000000000000000000000000000dEaD"
],
operator:
'not in'
}
]
}
]
}
});
Copy
Delete a Policy
Warning
Attempting to delete an account-level policy in-use by at least one account will fail.
const
policy
=
await
cdp
.
policies
.
deletePolicy
({
id:
'__POLICY_ID__'
});
Copy
Validate a Policy
If you're integrating policy editing into your application, you may find it useful to validate policies ahead of time to provide a user with feedback. The
CreatePolicyBodySchema
and
UpdatePolicyBodySchema
can be used to get actionable structured information about any issues with a policy. Read more about
handling ZodErrors
.
import
{
CreatePolicyBodySchema
,
UpdatePolicyBodySchema
}
from
"@coinbase/cdp-sdk"
;
// Validate a new Policy with many issues, will throw a ZodError with actionable validation errors
try
{
CreatePolicyBodySchema
.
parse
({
description:
'Bad description with !#@ characters, also is wayyyyy toooooo long!!'
,
rules:
[
{
action:
'acept'
,
operation:
'unknownOperation'
,
criteria:
[
{
type:
'ethValue'
,
ethValue:
'not a number'
,
operator:
'&lt;='
},
{
type:
'evmAddress'
,
addresses:
[
"not an address"
],
operator:
'in'
},
{
type:
'evmAddress'
,
addresses:
[
"not an address"
],
operator:
'invalid operator'
}
]
},
]
})
}
catch
(
e
) {
console
.
error
(
e
)
}
Copy
Authentication tools
This SDK also contains simple tools for authenticating REST API requests to the
Coinbase Developer Platform (CDP)
. See the
Auth README
for more details.
Error Reporting
This SDK contains error reporting functionality that sends error events to the CDP. If you would like to disable this behavior, you can set the
DISABLE_CDP_ERROR_REPORTING
environment variable to
true
.
DISABLE_CDP_ERROR_REPORTING
=
true
Copy
License
This project is licensed under the MIT License - see the
LICENSE
file for details.
Support
For feature requests, feedback, or questions, please reach out to us in the
#cdp-sdk
channel of the
Coinbase Developer Platform Discord
.
API Reference
SDK Docs
GitHub Issues
Security
If you discover a security vulnerability within this SDK, please see our
Security Policy
for disclosure information.
FAQ
Common errors and their solutions.
AggregateError [ETIMEDOUT]
This is an issue in Node.js itself:
https://github.com/nodejs/node/issues/54359
. While
the fix
is implemented, the workaround is to set the environment variable:
export
NODE_OPTIONS
=
"--network-family-autoselection-attempt-timeout=500"
Copy
Error [ERR_REQUIRE_ESM]: require() of ES modules is not supported.
Use Node v20.19.0 or higher. CDP SDK depends on
jose
v6, which ships only ESM. Jose supports CJS style imports in Node.js versions where the require(esm) feature is enabled by default (^20.19.0 || ^22.12.0 || &gt;= 23.0.0).
See here for more info
.
Jest encountered an unexpected token
If you're using Jest and see an error like this:
Details
:
/Users/
.../
node_modules
/
jose
/
dist
/
webapi
/
index
.
js
:
1
({
"Object.&lt;anonymous&gt;"
:
function
(
module
,
exports
,
require
,
__dirname
,
__filename
,
jest
){
export
{
compactDecrypt
}
from
'./jwe/compact/decrypt.js'
;
^^^^^^
SyntaxError
:
Unexpected
token
'export'
Copy
Add a file called
jest.setup.ts
next to your
jest.config
file with the following content:
jest
.
mock
(
"jose"
, ()
=&gt;
{});
Copy
Then, add the following line to your
jest.config
file:
setupFilesAfterEnv
: [
"&lt;rootDir&gt;/jest.setup.ts"
],
Copy
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Coinbase
Developer
Platform (CDP)
Type
Script SDK
Table of
Contents
CDP SDK
Documentation
Installation
API
Keys
Usage
Initialization
Load client config from shell
Load client config from .env file
Pass the API
Key and
Wallet
Secret to the client
Creating EVM or
Solana accounts
Create an EVM account as follows:
Create a
Solana account as follows:
Get or
Create an EVM account as follows:
Get or
Create a
Solana account as follows:
Updating EVM or
Solana accounts
Update an EVM account as follows:
Update a
Solana account as follows:
Testnet faucet
Request testnet ETH as follows:
Request testnet SOL as follows:
Sending transactions
EVM
Solana
EVM
Smart
Accounts
Create an EVM account and a smart account as follows:
Sending
User
Operations
In
Base
Sepolia, all user operations are gasless by default.
If you'd like to specify a different paymaster, you can do so as follows:
Transferring tokens
Account
Actions
EVM account actions
Solana account actions
Policy
Management
Create a
Project-
level policy that applies to all accounts
Create an
Account-
level policy
Create a
Solana
Allowlist
Policy
List
Policies
Retrieve a
Policy
Update a
Policy
Delete a
Policy
Validate a
Policy
Authentication tools
Error
Reporting
License
Support
Security
FAQ
Aggregate
Error [ETIMEDOUT]
Error [ERR_
REQUIRE_
ESM]: require() of ES modules is not supported.
Jest encountered an unexpected token
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript">
Preparing search index...
The search index is not available
Documentation
Documentation
Coinbase Developer Platform (CDP) TypeScript SDK
Table of Contents
CDP SDK
Documentation
Installation
API Keys
Usage
Policy Management
Authentication tools
Error Reporting
License
Support
Security
FAQ
Tip
If you're looking to contribute to the SDK, please see the
Contributing Guide
.
CDP SDK
This module contains the TypeScript CDP SDK, which is a library that provides a client for interacting with the
Coinbase Developer Platform (CDP)
. It includes a CDP Client for interacting with EVM and Solana APIs to create accounts and send transactions, policy APIs to govern transaction permissions, as well as authentication tools for interacting directly with the CDP APIs.
Documentation
CDP SDK has
auto-generated docs for the Typescript SDK
.
Further documentation is also available on the CDP docs website:
Wallet API v2
API Reference
Installation
npm
install
@coinbase/cdp-sdk
Copy
API Keys
To start,
create a CDP API Key
. Save the
API Key ID
and
API Key Secret
for use in the SDK. You will also need to create a wallet secret in the Portal to sign transactions.
Usage
Initialization
Load client config from shell
One option is to export your CDP API Key and Wallet Secret as environment variables:
export
CDP_API_KEY_ID
=
"YOUR_API_KEY_ID"
export
CDP_API_KEY_SECRET
=
"YOUR_API_KEY_SECRET"
export
CDP_WALLET_SECRET
=
"YOUR_WALLET_SECRET"
Copy
Then, initialize the client:
import
{
CdpClient
}
from
"@coinbase/cdp-sdk"
;
const
cdp
=
new
CdpClient
();
Copy
Load client config from
.env
file
Another option is to save your CDP API Key and Wallet Secret in a
.env
file:
touch
.env
echo
"CDP_API_KEY_ID=YOUR_API_KEY_ID"
&gt;&gt;
.env
echo
"CDP_API_KEY_SECRET=YOUR_API_KEY_SECRET"
&gt;&gt;
.env
echo
"CDP_WALLET_SECRET=YOUR_WALLET_SECRET"
&gt;&gt;
.env
Copy
Then, load the client config from the
.env
file:
import
{
CdpClient
}
from
"@coinbase/cdp-sdk"
;
import
dotenv
from
"dotenv"
;
dotenv
.
config
();
const
cdp
=
new
CdpClient
();
Copy
Pass the API Key and Wallet Secret to the client
Another option is to directly pass the API Key and Wallet Secret to the client:
const
cdp
=
new
CdpClient
({
apiKeyId:
"YOUR_API_KEY_ID"
,
apiKeySecret:
"YOUR_API_KEY_SECRET"
,
walletSecret:
"YOUR_WALLET_SECRET"
,
});
Copy
Creating EVM or Solana accounts
Create an EVM account as follows:
const
account
=
await
cdp
.
evm
.
createAccount
();
Copy
Create a Solana account as follows:
const
account
=
await
cdp
.
solana
.
createAccount
();
Copy
Get or Create an EVM account as follows:
const
account
=
await
cdp
.
evm
.
getOrCreateAccount
({
name:
"Account1"
,
});
Copy
Get or Create a Solana account as follows:
const
account
=
await
cdp
.
solana
.
getOrCreateAccount
({
name:
"Account1"
,
});
Copy
Updating EVM or Solana accounts
Update an EVM account as follows:
const
account
=
await
cdp
.
evm
.
updateAccount
({
addresss:
account
.
address
,
update:
{
name:
"Updated name"
,
accountPolicy:
"1622d4b7-9d60-44a2-9a6a-e9bbb167e412"
}
});
Copy
Update a Solana account as follows:
const
account
=
await
cdp
.
solana
.
updateAccount
({
addresss:
account
.
address
,
update:
{
name:
"Updated name"
,
accountPolicy:
"1622d4b7-9d60-44a2-9a6a-e9bbb167e412"
}
});
Copy
Testnet faucet
You can use the faucet function to request testnet ETH or SOL from the CDP.
Request testnet ETH as follows:
const
faucetResp
=
await
cdp
.
evm
.
requestFaucet
({
address:
evmAccount
.
address
,
network:
"base-sepolia"
,
token:
"eth"
,
});
Copy
Request testnet SOL as follows:
const
faucetResp
=
await
cdp
.
solana
.
requestFaucet
({
address:
fromAddress
,
token:
"sol"
,
});
Copy
Sending transactions
EVM
You can use CDP SDK to send transactions on EVM networks.
import
{
CdpClient
}
from
"@coinbase/cdp-sdk"
;
import
{
parseEther
,
createPublicClient
,
http
}
from
"viem"
;
import
{
baseSepolia
}
from
"viem/chains"
;
const
publicClient
=
createPublicClient
({
chain:
baseSepolia
,
transport:
http
(),
});
const
cdp
=
new
CdpClient
();
const
account
=
await
cdp
.
evm
.
createAccount
();
const
faucetResp
=
await
cdp
.
evm
.
requestFaucet
({
address:
account
.
address
,
network:
"base-sepolia"
,
token:
"eth"
,
});
const
faucetTxReceipt
=
await
publicClient
.
waitForTransactionReceipt
({
hash:
faucetResp
.
transactionHash
,
});
const
{
transactionHash
} =
await
cdp
.
evm
.
sendTransaction
({
address:
account
.
address
,
network:
"base-sepolia"
,
transaction:
{
to:
"0x4252e0c9A3da5A2700e7d91cb50aEf522D0C6Fe8"
,
value:
parseEther
(
"0.000001"
),
},
});
await
publicClient
.
waitForTransactionReceipt
({
hash:
transactionHash
});
console
.
log
(
`Transaction confirmed! Explorer link: https://sepolia.basescan.org/tx/
${
transactionHash
}
`
,
);
Copy
CDP SDK is fully viem-compatible, so you can optionally use a
walletClient
to send transactions.
import
{
CdpClient
}
from
"@coinbase/cdp-sdk"
;
import
{
parseEther
,
createPublicClient
,
http
,
createWalletClient
,
toAccount
}
from
"viem"
;
import
{
baseSepolia
}
from
"viem/chains"
;
const
publicClient
=
createPublicClient
({
chain:
baseSepolia
,
transport:
http
(),
});
const
cdp
=
new
CdpClient
();
const
account
=
await
cdp
.
evm
.
createAccount
();
const
faucetResp
=
await
cdp
.
evm
.
requestFaucet
({
address:
account
.
address
,
network:
"base-sepolia"
,
token:
"eth"
,
});
const
faucetTxReceipt
=
await
publicClient
.
waitForTransactionReceipt
({
hash:
faucetResp
.
transactionHash
,
});
const
walletClient
=
createWalletClient
({
account:
toAccount
(
serverAccount
),
chain:
baseSepolia
,
transport:
http
(),
});
// Step 3: Sign the transaction with CDP and broadcast it using the wallet client.
const
hash
=
await
walletClient
.
sendTransaction
({
to:
"0x4252e0c9A3da5A2700e7d91cb50aEf522D0C6Fe8"
,
value:
parseEther
(
"0.000001"
),
});
console
.
log
(
`Transaction confirmed! Explorer link: https://sepolia.basescan.org/tx/
${
hash
}
`
);
Copy
Solana
For Solana, we recommend using the
@solana/web3.js
library to send transactions. See the
examples
.
EVM Smart Accounts
For EVM, we support Smart Accounts which are account-abstraction (ERC-4337) accounts. Currently there is only support for Base Sepolia and Base Mainnet for Smart Accounts.
Create an EVM account and a smart account as follows:
const
evmAccount
=
await
cdp
.
evm
.
createAccount
();
const
smartAccount
=
await
cdp
.
evm
.
createSmartAccount
({
owner:
evmAccount
,
});
Copy
Sending User Operations
const
userOperation
=
await
cdp
.
evm
.
sendUserOperation
({
smartAccount:
smartAccount
,
network:
"base-sepolia"
,
calls:
[
{
to:
"0x0000000000000000000000000000000000000000"
,
value:
parseEther
(
"0.000001"
),
data:
"0x"
,
},
],
});
Copy
In Base Sepolia, all user operations are gasless by default. If you'd like to specify a different paymaster, you can do so as follows:
const
userOperation
=
await
cdp
.
sendUserOperation
({
smartAccount:
smartAccount
,
network:
"base-sepolia"
,
calls:
[
{
to:
"0x0000000000000000000000000000000000000000"
,
value:
parseEther
(
"0"
),
data:
"0x"
,
},
],
paymasterUrl:
"https://some-paymaster-url.com"
,
});
Copy
Transferring tokens
For complete examples, check out
transfer.ts
and
transferWithSmartWallet.ts
.
You can transfer tokens between accounts using the
transfer
function:
const
sender
=
await
cdp
.
evm
.
createAccount
({
name:
"Sender"
});
const
{
status
} =
await
sender
.
transfer
({
to:
"0x9F663335Cd6Ad02a37B633602E98866CF944124d"
,
amount:
"0.01"
,
token:
"usdc"
,
network:
"base-sepolia"
,
});
Copy
Smart Accounts also have a
transfer
function:
const
sender
=
await
cdp
.
evm
.
createSmartAccount
({
owner:
privateKeyToAccount
(
generatePrivateKey
()),
});
console
.
log
(
"Created smart account"
,
sender
);
const
{
status
} =
await
sender
.
transfer
({
to:
"0x9F663335Cd6Ad02a37B633602E98866CF944124d"
,
amount:
"0.01"
,
token:
"usdc"
,
network:
"base-sepolia"
,
});
Copy
Using Smart Accounts, you can also specify a paymaster URL and wait options:
const
{
status
} =
await
sender
.
transfer
({
to:
"0x9F663335Cd6Ad02a37B633602E98866CF944124d"
,
amount:
"0.01"
,
token:
"usdc"
,
network:
"base-sepolia"
,
paymasterUrl:
"https://some-paymaster-url.com"
,
waitOptions:
{
timeout:
30
,
interval:
2
,
},
});
Copy
If you pass a decimal amount in a string, the SDK will parse it into a bigint based on the token's decimals. You can also pass a bigint directly:
const
{
status
} =
await
sender
.
transfer
({
to:
"0x9F663335Cd6Ad02a37B633602E98866CF944124d"
,
amount:
10000
n
,
// equivalent to 0.01 usdc
token:
"usdc"
,
network:
"base-sepolia"
,
});
Copy
You can pass
usdc
or
eth
as the token to transfer, or you can pass a contract address directly:
const
{
status
} =
await
sender
.
transfer
({
to:
"0x9F663335Cd6Ad02a37B633602E98866CF944124d"
,
amount:
"0.000001"
,
token:
"0x4200000000000000000000000000000000000006"
,
// WETH on Base Sepolia
network:
"base-sepolia"
,
});
Copy
You can also pass another account as the
to
parameter:
const
sender
=
await
cdp
.
evm
.
createAccount
({
name:
"Sender"
});
const
receiver
=
await
cdp
.
evm
.
createAccount
({
name:
"Receiver"
});
const
{
status
} =
await
sender
.
transfer
({
to:
receiver
,
amount:
"0.01"
,
token:
"usdc"
,
network:
"base-sepolia"
,
});
Copy
You can also pass wait options to the
transfer
function:
const
{
status
} =
await
sender
.
transfer
({
to:
receiver
,
amount:
"0.01"
,
token:
"usdc"
,
network:
"base-sepolia"
,
waitOptions:
{
timeout:
30
,
interval:
2
,
},
});
Copy
Account Actions
Account objects have actions that can be used to interact with the account. These can be used in place of the
cdp
client.
EVM account actions
Here are some examples for actions on EVM accounts.
For example, instead of:
const
balances
=
await
cdp
.
evm
.
listTokenBalances
({
address:
account
.
address
,
network:
"base-sepolia"
,
});
Copy
You can use the
listTokenBalances
action:
const
account
=
await
cdp
.
evm
.
createAccount
();
const
balances
=
await
account
.
listTokenBalances
({
network:
"base-sepolia"
});
Copy
EvmAccount supports the following actions:
listTokenBalances
requestFaucet
signTransaction
sendTransaction
transfer
EvmSmartAccount supports the following actions:
listTokenBalances
requestFaucet
sendUserOperation
waitForUserOperation
getUserOperation
transfer
Solana account actions
Here are some examples for actions on Solana accounts.
const
balances
=
await
cdp
.
solana
.
signMessage
({
address:
account
.
address
,
message:
"Hello, world!"
,
});
Copy
You can use the
signMessage
action:
const
account
=
await
cdp
.
solana
.
createAccount
();
const
{
signature
} =
await
account
.
signMessage
({
message:
"Hello, world!"
});
Copy
SolanaAccount supports the following actions:
requestFaucet
signMessage
signTransaction
Policy Management
You can use the policies SDK to manage sets of rules that govern the behavior of accounts and projects, such as enforce allowlists and denylists.
Create a Project-level policy that applies to all accounts
This policy will accept any account sending less than a specific amount of ETH to a specific address.
const
policy
=
await
cdp
.
policies
.
createPolicy
({
policy:
{
scope:
'project'
,
description:
'Project-wide Allowlist Policy'
,
rules:
[
{
action:
'accept'
,
operation:
'signEvmTransaction'
,
criteria:
[
{
type:
'ethValue'
,
ethValue:
'1000000000000000000'
,
operator:
'&lt;='
},
{
type:
'evmAddress'
,
addresses:
[
"0x000000000000000000000000000000000000dEaD"
],
operator:
'in'
}
]
}
]
}
});
Copy
Create an Account-level policy
This policy will accept any transaction with a value less than or equal to 1 ETH to a specific address.
const
policy
=
await
cdp
.
policies
.
createPolicy
({
policy:
{
scope:
'account'
,
description:
'Account Allowlist Policy'
,
rules:
[
{
action:
'accept'
,
operation:
'signEvmTransaction'
,
criteria:
[
{
type:
'ethValue'
,
ethValue:
'1000000000000000000'
,
operator:
'&lt;='
},
{
type:
'evmAddress'
,
addresses:
[
"0x000000000000000000000000000000000000dEaD"
],
operator:
'in'
}
]
}
]
}
});
Copy
Create a Solana Allowlist Policy
const
policy
=
await
cdp
.
policies
.
createPolicy
({
policy:
{
scope:
'account'
,
description:
'Account Allowlist Policy'
,
rules:
[
{
action:
'accept'
,
operation:
'signSolTransaction'
,
criteria:
[
{
type:
'solAddress'
,
addresses:
[
"DtdSSG8ZJRZVv5Jx7K1MeWp7Zxcu19GD5wQRGRpQ9uMF"
],
operator:
'in'
}
]
}
]
}
});
Copy
List Policies
You can filter by account:
const
policy
=
await
cdp
.
policies
.
listPolicies
({
scope:
'account'
});
Copy
You can also filter by project:
const
policy
=
await
cdp
.
policies
.
listPolicies
({
scope:
'project'
});
Copy
Retrieve a Policy
const
policy
=
await
cdp
.
policies
.
getPolicyById
({
id:
'__POLICY_ID__'
});
Copy
Update a Policy
This policy will update an existing policy to accept transactions to any address except one.
const
policy
=
await
cdp
.
policies
.
updatePolicy
({
id:
'__POLICY_ID__'
,
policy:
{
description:
'Updated Account Denylist Policy'
,
rules:
[
{
action:
'accept'
,
operation:
'signEvmTransaction'
,
criteria:
[
{
type:
'evmAddress'
,
addresses:
[
"0x000000000000000000000000000000000000dEaD"
],
operator:
'not in'
}
]
}
]
}
});
Copy
Delete a Policy
Warning
Attempting to delete an account-level policy in-use by at least one account will fail.
const
policy
=
await
cdp
.
policies
.
deletePolicy
({
id:
'__POLICY_ID__'
});
Copy
Validate a Policy
If you're integrating policy editing into your application, you may find it useful to validate policies ahead of time to provide a user with feedback. The
CreatePolicyBodySchema
and
UpdatePolicyBodySchema
can be used to get actionable structured information about any issues with a policy. Read more about
handling ZodErrors
.
import
{
CreatePolicyBodySchema
,
UpdatePolicyBodySchema
}
from
"@coinbase/cdp-sdk"
;
// Validate a new Policy with many issues, will throw a ZodError with actionable validation errors
try
{
CreatePolicyBodySchema
.
parse
({
description:
'Bad description with !#@ characters, also is wayyyyy toooooo long!!'
,
rules:
[
{
action:
'acept'
,
operation:
'unknownOperation'
,
criteria:
[
{
type:
'ethValue'
,
ethValue:
'not a number'
,
operator:
'&lt;='
},
{
type:
'evmAddress'
,
addresses:
[
"not an address"
],
operator:
'in'
},
{
type:
'evmAddress'
,
addresses:
[
"not an address"
],
operator:
'invalid operator'
}
]
},
]
})
}
catch
(
e
) {
console
.
error
(
e
)
}
Copy
Authentication tools
This SDK also contains simple tools for authenticating REST API requests to the
Coinbase Developer Platform (CDP)
. See the
Auth README
for more details.
Error Reporting
This SDK contains error reporting functionality that sends error events to the CDP. If you would like to disable this behavior, you can set the
DISABLE_CDP_ERROR_REPORTING
environment variable to
true
.
DISABLE_CDP_ERROR_REPORTING
=
true
Copy
License
This project is licensed under the MIT License - see the
LICENSE
file for details.
Support
For feature requests, feedback, or questions, please reach out to us in the
#cdp-sdk
channel of the
Coinbase Developer Platform Discord
.
API Reference
SDK Docs
GitHub Issues
Security
If you discover a security vulnerability within this SDK, please see our
Security Policy
for disclosure information.
FAQ
Common errors and their solutions.
AggregateError [ETIMEDOUT]
This is an issue in Node.js itself:
https://github.com/nodejs/node/issues/54359
. While
the fix
is implemented, the workaround is to set the environment variable:
export
NODE_OPTIONS
=
"--network-family-autoselection-attempt-timeout=500"
Copy
Error [ERR_REQUIRE_ESM]: require() of ES modules is not supported.
Use Node v20.19.0 or higher. CDP SDK depends on
jose
v6, which ships only ESM. Jose supports CJS style imports in Node.js versions where the require(esm) feature is enabled by default (^20.19.0 || ^22.12.0 || &gt;= 23.0.0).
See here for more info
.
Jest encountered an unexpected token
If you're using Jest and see an error like this:
Details
:
/Users/
.../
node_modules
/
jose
/
dist
/
webapi
/
index
.
js
:
1
({
"Object.&lt;anonymous&gt;"
:
function
(
module
,
exports
,
require
,
__dirname
,
__filename
,
jest
){
export
{
compactDecrypt
}
from
'./jwe/compact/decrypt.js'
;
^^^^^^
SyntaxError
:
Unexpected
token
'export'
Copy
Add a file called
jest.setup.ts
next to your
jest.config
file with the following content:
jest
.
mock
(
"jose"
, ()
=&gt;
{});
Copy
Then, add the following line to your
jest.config
file:
setupFilesAfterEnv
: [
"&lt;rootDir&gt;/jest.setup.ts"
],
Copy
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Coinbase
Developer
Platform (CDP)
Type
Script SDK
Table of
Contents
CDP SDK
Documentation
Installation
API
Keys
Usage
Initialization
Load client config from shell
Load client config from .env file
Pass the API
Key and
Wallet
Secret to the client
Creating EVM or
Solana accounts
Create an EVM account as follows:
Create a
Solana account as follows:
Get or
Create an EVM account as follows:
Get or
Create a
Solana account as follows:
Updating EVM or
Solana accounts
Update an EVM account as follows:
Update a
Solana account as follows:
Testnet faucet
Request testnet ETH as follows:
Request testnet SOL as follows:
Sending transactions
EVM
Solana
EVM
Smart
Accounts
Create an EVM account and a smart account as follows:
Sending
User
Operations
In
Base
Sepolia, all user operations are gasless by default.
If you'd like to specify a different paymaster, you can do so as follows:
Transferring tokens
Account
Actions
EVM account actions
Solana account actions
Policy
Management
Create a
Project-
level policy that applies to all accounts
Create an
Account-
level policy
Create a
Solana
Allowlist
Policy
List
Policies
Retrieve a
Policy
Update a
Policy
Delete a
Policy
Validate a
Policy
Authentication tools
Error
Reporting
License
Support
Security
FAQ
Aggregate
Error [ETIMEDOUT]
Error [ERR_
REQUIRE_
ESM]: require() of ES modules is not supported.
Jest encountered an unexpected token
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules.html">
Preparing search index...
The search index is not available
Documentation
Documentation
Documentation
Modules
accounts/evm/toEvmServerAccount
accounts/evm/toEvmSmartAccount
accounts/evm/types
accounts/solana/toSolanaAccount
accounts/solana/types
actions/evm/getUserOperation
actions/evm/listTokenBalances
actions/evm/requestFaucet
actions/evm/sendTransaction
actions/evm/sendUserOperation
actions/evm/transfer/accountTransferStrategy
actions/evm/transfer/smartAccountTransferStrategy
actions/evm/transfer/transfer
actions/evm/transfer/types
actions/evm/transfer/utils
actions/evm/types
actions/evm/waitForUserOperation
actions/solana/requestFaucet
actions/solana/signMessage
actions/solana/signTransaction
actions/solana/types
analytics
auth
auth/errors
auth/hooks/axios
auth/hooks/axios/withAuth
auth/utils
auth/utils/http
auth/utils/jwt
auth/utils/ws
client/cdp
client/evm/evm
client/evm/evm.types
client/policies
client/policies/policies
client/policies/policies.types
client/solana
client/solana/solana
client/solana/solana.types
constants
errors
index
openapi-client
openapi-client/cdpApiClient
openapi-client/errors
openapi-client/generated/coinbaseDeveloperPlatformAPIs.schemas
openapi-client/generated/evm-accounts/evm-accounts
openapi-client/generated/evm-accounts/evm-accounts.msw
openapi-client/generated/evm-smart-accounts/evm-smart-accounts
openapi-client/generated/evm-smart-accounts/evm-smart-accounts.msw
openapi-client/generated/evm-token-balances/evm-token-balances
openapi-client/generated/evm-token-balances/evm-token-balances.msw
openapi-client/generated/faucets/faucets
openapi-client/generated/faucets/faucets.msw
openapi-client/generated/index.msw
openapi-client/generated/policy-engine/policy-engine
openapi-client/generated/policy-engine/policy-engine.msw
openapi-client/generated/solana-accounts/solana-accounts
openapi-client/generated/solana-accounts/solana-accounts.msw
policies/schema
policies/types
types/calls
types/contract
types/misc
types/multicall
types/utils
utils/serializeTransaction
utils/wait
version
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Modules
accounts/evm/to
Evm
Server
Account
accounts/evm/to
Evm
Smart
Account
accounts/evm/types
accounts/solana/to
Solana
Account
accounts/solana/types
actions/evm/get
User
Operation
actions/evm/list
Token
Balances
actions/evm/request
Faucet
actions/evm/send
Transaction
actions/evm/send
User
Operation
actions/evm/transfer/account
Transfer
Strategy
actions/evm/transfer/smart
Account
Transfer
Strategy
actions/evm/transfer/transfer
actions/evm/transfer/types
actions/evm/transfer/utils
actions/evm/types
actions/evm/wait
For
User
Operation
actions/solana/request
Faucet
actions/solana/sign
Message
actions/solana/sign
Transaction
actions/solana/types
analytics
auth
auth/errors
auth/hooks/axios
auth/hooks/axios/with
Auth
auth/utils
auth/utils/http
auth/utils/jwt
auth/utils/ws
client/cdp
client/evm/evm
client/evm/evm.types
client/policies
client/policies/policies
client/policies/policies.types
client/solana
client/solana/solana
client/solana/solana.types
constants
errors
index
openapi-
client
openapi-
client/cdp
Api
Client
openapi-
client/errors
openapi-
client/generated/coinbase
Developer
PlatformAPIs.schemas
openapi-
client/generated/evm-
accounts/evm-
accounts
openapi-
client/generated/evm-
accounts/evm-
accounts.msw
openapi-
client/generated/evm-
smart-
accounts/evm-
smart-
accounts
openapi-
client/generated/evm-
smart-
accounts/evm-
smart-
accounts.msw
openapi-
client/generated/evm-
token-
balances/evm-
token-
balances
openapi-
client/generated/evm-
token-
balances/evm-
token-
balances.msw
openapi-
client/generated/faucets/faucets
openapi-
client/generated/faucets/faucets.msw
openapi-
client/generated/index.msw
openapi-
client/generated/policy-
engine/policy-
engine
openapi-
client/generated/policy-
engine/policy-
engine.msw
openapi-
client/generated/solana-
accounts/solana-
accounts
openapi-
client/generated/solana-
accounts/solana-
accounts.msw
policies/schema
policies/types
types/calls
types/contract
types/misc
types/multicall
types/utils
utils/serialize
Transaction
utils/wait
version
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/accounts_evm_toEvmServerAccount.html">
Preparing search index...
The search index is not available
Documentation
Documentation
accounts/evm/toEvmServerAccount
Module accounts/evm/toEvmServerAccount
Type Aliases
ToEvmServerAccountOptions
Functions
toEvmServerAccount
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Type Aliases
To
Evm
Server
Account
Options
Functions
to
Evm
Server
Account
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/accounts_evm_toEvmSmartAccount.html">
Preparing search index...
The search index is not available
Documentation
Documentation
accounts/evm/toEvmSmartAccount
Module accounts/evm/toEvmSmartAccount
Type Aliases
ToEvmSmartAccountOptions
Functions
toEvmSmartAccount
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Type Aliases
To
Evm
Smart
Account
Options
Functions
to
Evm
Smart
Account
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/accounts_evm_types.html">
Preparing search index...
The search index is not available
Documentation
Documentation
accounts/evm/types
Module accounts/evm/types
Type Aliases
EvmAccount
EvmServerAccount
EvmSmartAccount
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Type Aliases
Evm
Account
Evm
Server
Account
Evm
Smart
Account
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/accounts_solana_toSolanaAccount.html">
Preparing search index...
The search index is not available
Documentation
Documentation
accounts/solana/toSolanaAccount
Module accounts/solana/toSolanaAccount
Type Aliases
ToSolanaAccountOptions
Functions
toSolanaAccount
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Type Aliases
To
Solana
Account
Options
Functions
to
Solana
Account
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/accounts_solana_types.html">
Preparing search index...
The search index is not available
Documentation
Documentation
accounts/solana/types
Module accounts/solana/types
Type Aliases
Account
SolanaAccount
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Type Aliases
Account
Solana
Account
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/actions_evm_getUserOperation.html">
Preparing search index...
The search index is not available
Documentation
Documentation
actions/evm/getUserOperation
Module actions/evm/getUserOperation
Functions
getUserOperation
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Functions
get
User
Operation
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/actions_evm_listTokenBalances.html">
Preparing search index...
The search index is not available
Documentation
Documentation
actions/evm/listTokenBalances
Module actions/evm/listTokenBalances
Interfaces
EvmToken
EvmTokenAmount
EvmTokenBalance
ListTokenBalancesOptions
ListTokenBalancesResult
Functions
listTokenBalances
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Interfaces
Evm
Token
Evm
Token
Amount
Evm
Token
Balance
List
Token
Balances
Options
List
Token
Balances
Result
Functions
list
Token
Balances
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/actions_evm_requestFaucet.html">
Preparing search index...
The search index is not available
Documentation
Documentation
actions/evm/requestFaucet
Module actions/evm/requestFaucet
Interfaces
RequestFaucetOptions
RequestFaucetResult
Functions
requestFaucet
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Interfaces
Request
Faucet
Options
Request
Faucet
Result
Functions
request
Faucet
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/actions_evm_sendTransaction.html">
Preparing search index...
The search index is not available
Documentation
Documentation
actions/evm/sendTransaction
Module actions/evm/sendTransaction
Interfaces
SendTransactionOptions
TransactionResult
Functions
sendTransaction
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Interfaces
Send
Transaction
Options
Transaction
Result
Functions
send
Transaction
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/actions_evm_sendUserOperation.html">
Preparing search index...
The search index is not available
Documentation
Documentation
actions/evm/sendUserOperation
Module actions/evm/sendUserOperation
Type Aliases
SendUserOperationOptions
SendUserOperationReturnType
Functions
sendUserOperation
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Type Aliases
Send
User
Operation
Options
Send
User
Operation
Return
Type
Functions
send
User
Operation
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/actions_evm_transfer_accountTransferStrategy.html">
Preparing search index...
The search index is not available
Documentation
Documentation
actions/evm/transfer/accountTransferStrategy
Module actions/evm/transfer/accountTransferStrategy
Variables
accountTransferStrategy
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Variables
account
Transfer
Strategy
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/actions_evm_transfer_smartAccountTransferStrategy.html">
Preparing search index...
The search index is not available
Documentation
Documentation
actions/evm/transfer/smartAccountTransferStrategy
Module actions/evm/transfer/smartAccountTransferStrategy
Variables
smartAccountTransferStrategy
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Variables
smart
Account
Transfer
Strategy
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/actions_evm_transfer_transfer.html">
Preparing search index...
The search index is not available
Documentation
Documentation
actions/evm/transfer/transfer
Module actions/evm/transfer/transfer
Functions
transfer
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Functions
transfer
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/actions_evm_transfer_types.html">
Preparing search index...
The search index is not available
Documentation
Documentation
actions/evm/transfer/types
Module actions/evm/transfer/types
Interfaces
TransferExecutionStrategy
Type Aliases
AccountTransferOptions
Network
SmartAccountTransferOptions
TransferOptions
TransferResult
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Interfaces
Transfer
Execution
Strategy
Type Aliases
Account
Transfer
Options
Network
Smart
Account
Transfer
Options
Transfer
Options
Transfer
Result
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/actions_evm_transfer_utils.html">
Preparing search index...
The search index is not available
Documentation
Documentation
actions/evm/transfer/utils
Module actions/evm/transfer/utils
Functions
getErc20Address
mapNetworkToChain
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Functions
get
Erc20
Address
map
Network
To
Chain
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/actions_evm_types.html">
Preparing search index...
The search index is not available
Documentation
Documentation
actions/evm/types
Module actions/evm/types
Type Aliases
AccountActions
SmartAccountActions
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Type Aliases
Account
Actions
Smart
Account
Actions
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/actions_evm_waitForUserOperation.html">
Preparing search index...
The search index is not available
Documentation
Documentation
actions/evm/waitForUserOperation
Module actions/evm/waitForUserOperation
Type Aliases
CompletedOperation
FailedOperation
WaitForUserOperationOptions
WaitForUserOperationReturnType
Functions
waitForUserOperation
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Type Aliases
Completed
Operation
Failed
Operation
Wait
For
User
Operation
Options
Wait
For
User
Operation
Return
Type
Functions
wait
For
User
Operation
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/actions_solana_requestFaucet.html">
Preparing search index...
The search index is not available
Documentation
Documentation
actions/solana/requestFaucet
Module actions/solana/requestFaucet
Functions
requestFaucet
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Functions
request
Faucet
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/actions_solana_signMessage.html">
Preparing search index...
The search index is not available
Documentation
Documentation
actions/solana/signMessage
Module actions/solana/signMessage
Functions
signMessage
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Functions
sign
Message
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/actions_solana_signTransaction.html">
Preparing search index...
The search index is not available
Documentation
Documentation
actions/solana/signTransaction
Module actions/solana/signTransaction
Functions
signTransaction
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Functions
sign
Transaction
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/actions_solana_types.html">
Preparing search index...
The search index is not available
Documentation
Documentation
actions/solana/types
Module actions/solana/types
Type Aliases
AccountActions
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Type Aliases
Account
Actions
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/analytics.html">
Preparing search index...
The search index is not available
Documentation
Documentation
analytics
Module analytics
Variables
Analytics
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Variables
Analytics
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/auth.html">
Preparing search index...
The search index is not available
Documentation
Documentation
auth
Module auth
References
axiosHooks
→
auth/hooks/axios
generateJwt
→
generateJwt
generateWalletJwt
→
generateWalletJwt
getAuthHeaders
→
getAuthHeaders
GetAuthHeadersOptions
→
GetAuthHeadersOptions
getCorrelationData
→
getCorrelationData
getWebSocketAuthHeaders
→
getWebSocketAuthHeaders
GetWebSocketAuthHeadersOptions
→
GetWebSocketAuthHeadersOptions
JwtOptions
→
JwtOptions
WalletJwtOptions
→
WalletJwtOptions
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
References
axios
Hooks
generate
Jwt
generate
Wallet
Jwt
get
Auth
Headers
Get
Auth
Headers
Options
get
Correlation
Data
get
Web
Socket
Auth
Headers
Get
Web
Socket
Auth
Headers
Options
Jwt
Options
Wallet
Jwt
Options
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/auth_errors.html">
Preparing search index...
The search index is not available
Documentation
Documentation
auth/errors
Module auth/errors
Classes
InvalidAPIKeyFormatError
InvalidWalletSecretFormatError
UndefinedWalletSecretError
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Classes
InvalidAPIKey
Format
Error
Invalid
Wallet
Secret
Format
Error
Undefined
Wallet
Secret
Error
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/auth_hooks_axios.html">
Preparing search index...
The search index is not available
Documentation
Documentation
auth/hooks/axios
Module auth/hooks/axios
References
AuthInterceptorOptions
→
AuthInterceptorOptions
withAuth
→
withAuth
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
References
Auth
Interceptor
Options
with
Auth
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/auth_hooks_axios_withAuth.html">
Preparing search index...
The search index is not available
Documentation
Documentation
auth/hooks/axios/withAuth
Module auth/hooks/axios/withAuth
Interfaces
AuthInterceptorOptions
Functions
withAuth
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Interfaces
Auth
Interceptor
Options
Functions
with
Auth
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/auth_utils.html">
Preparing search index...
The search index is not available
Documentation
Documentation
auth/utils
Module auth/utils
References
generateJwt
→
generateJwt
generateWalletJwt
→
generateWalletJwt
getAuthHeaders
→
getAuthHeaders
GetAuthHeadersOptions
→
GetAuthHeadersOptions
getCorrelationData
→
getCorrelationData
getWebSocketAuthHeaders
→
getWebSocketAuthHeaders
GetWebSocketAuthHeadersOptions
→
GetWebSocketAuthHeadersOptions
JwtOptions
→
JwtOptions
WalletJwtOptions
→
WalletJwtOptions
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
References
generate
Jwt
generate
Wallet
Jwt
get
Auth
Headers
Get
Auth
Headers
Options
get
Correlation
Data
get
Web
Socket
Auth
Headers
Get
Web
Socket
Auth
Headers
Options
Jwt
Options
Wallet
Jwt
Options
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/auth_utils_http.html">
Preparing search index...
The search index is not available
Documentation
Documentation
auth/utils/http
Module auth/utils/http
Interfaces
GetAuthHeadersOptions
Functions
getAuthHeaders
getCorrelationData
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Interfaces
Get
Auth
Headers
Options
Functions
get
Auth
Headers
get
Correlation
Data
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/auth_utils_jwt.html">
Preparing search index...
The search index is not available
Documentation
Documentation
auth/utils/jwt
Module auth/utils/jwt
Interfaces
JwtOptions
WalletJwtOptions
Functions
generateJwt
generateWalletJwt
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Interfaces
Jwt
Options
Wallet
Jwt
Options
Functions
generate
Jwt
generate
Wallet
Jwt
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/auth_utils_ws.html">
Preparing search index...
The search index is not available
Documentation
Documentation
auth/utils/ws
Module auth/utils/ws
Interfaces
GetWebSocketAuthHeadersOptions
Functions
getWebSocketAuthHeaders
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Interfaces
Get
Web
Socket
Auth
Headers
Options
Functions
get
Web
Socket
Auth
Headers
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/client_cdp.html">
Preparing search index...
The search index is not available
Documentation
Documentation
client/cdp
Module client/cdp
Classes
CdpClient
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Classes
Cdp
Client
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/client_evm_evm.html">
Preparing search index...
The search index is not available
Documentation
Documentation
client/evm/evm
Module client/evm/evm
Classes
EvmClient
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Classes
Evm
Client
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/client_evm_evm.types.html">
Preparing search index...
The search index is not available
Documentation
Documentation
client/evm/evm.types
Module client/evm/evm.types
Interfaces
CreateServerAccountOptions
CreateSmartAccountOptions
EvmCall
GetOrCreateServerAccountOptions
GetServerAccountOptions
GetSmartAccountOptions
GetUserOperationOptions
ListServerAccountResult
ListServerAccountsOptions
ListSmartAccountResult
ListSmartAccountsOptions
PrepareUserOperationOptions
ReadonlySmartAccount
SignatureResult
SignHashOptions
SignMessageOptions
SignTransactionOptions
SignTypedDataOptions
UpdateEvmAccountOptions
UserOperation
WaitForUserOperationOptions
Type Aliases
EvmClientInterface
References
ServerAccount
→
EvmServerAccount
SmartAccount
→
EvmSmartAccount
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Interfaces
Create
Server
Account
Options
Create
Smart
Account
Options
Evm
Call
Get
Or
Create
Server
Account
Options
Get
Server
Account
Options
Get
Smart
Account
Options
Get
User
Operation
Options
List
Server
Account
Result
List
Server
Accounts
Options
List
Smart
Account
Result
List
Smart
Accounts
Options
Prepare
User
Operation
Options
Readonly
Smart
Account
Signature
Result
Sign
Hash
Options
Sign
Message
Options
Sign
Transaction
Options
Sign
Typed
Data
Options
Update
Evm
Account
Options
User
Operation
Wait
For
User
Operation
Options
Type Aliases
Evm
Client
Interface
References
Server
Account
Smart
Account
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/client_policies.html">
Preparing search index...
The search index is not available
Documentation
Documentation
client/policies
Module client/policies
References
PoliciesClient
→
PoliciesClient
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
References
Policies
Client
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/client_policies_policies.html">
Preparing search index...
The search index is not available
Documentation
Documentation
client/policies/policies
Module client/policies/policies
Classes
PoliciesClient
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Classes
Policies
Client
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/client_policies_policies.types.html">
Preparing search index...
The search index is not available
Documentation
Documentation
client/policies/policies.types
Module client/policies/policies.types
Interfaces
CreatePolicyOptions
DeletePolicyOptions
GetPolicyByIdOptions
ListPoliciesOptions
ListPoliciesResult
UpdatePolicyOptions
Type Aliases
PoliciesClientInterface
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Interfaces
Create
Policy
Options
Delete
Policy
Options
Get
Policy
By
Id
Options
List
Policies
Options
List
Policies
Result
Update
Policy
Options
Type Aliases
Policies
Client
Interface
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/client_solana.html">
Preparing search index...
The search index is not available
Documentation
Documentation
client/solana
Module client/solana
References
SolanaClient
→
SolanaClient
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
References
Solana
Client
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/client_solana_solana.html">
Preparing search index...
The search index is not available
Documentation
Documentation
client/solana/solana
Module client/solana/solana
Classes
SolanaClient
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Classes
Solana
Client
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/client_solana_solana.types.html">
Preparing search index...
The search index is not available
Documentation
Documentation
client/solana/solana.types
Module client/solana/solana.types
Interfaces
CreateAccountOptions
GetAccountOptions
GetOrCreateAccountOptions
ListAccountsOptions
ListAccountsResult
RequestFaucetOptions
SignatureResult
SignMessageOptions
SignTransactionOptions
UpdateSolanaAccountOptions
Type Aliases
SolanaClientInterface
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Interfaces
Create
Account
Options
Get
Account
Options
Get
Or
Create
Account
Options
List
Accounts
Options
List
Accounts
Result
Request
Faucet
Options
Signature
Result
Sign
Message
Options
Sign
Transaction
Options
Update
Solana
Account
Options
Type Aliases
Solana
Client
Interface
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/constants.html">
Preparing search index...
The search index is not available
Documentation
Documentation
constants
Module constants
Variables
ERROR_DOCS_PAGE_URL
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Variables
ERROR_
DOCS_
PAGE_
URL
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/errors.html">
Preparing search index...
The search index is not available
Documentation
Documentation
errors
Module errors
Classes
TimeoutError
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Classes
Timeout
Error
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/index.html">
Preparing search index...
The search index is not available
Documentation
Documentation
index
Module index
References
CdpClient
→
CdpClient
CreatePolicyBody
→
CreatePolicyBody
CreatePolicyBodySchema
→
CreatePolicyBodySchema
EvmServerAccount
→
EvmServerAccount
EvmSmartAccount
→
EvmSmartAccount
Policy
→
Policy
UpdatePolicyBody
→
UpdatePolicyBody
UpdatePolicyBodySchema
→
UpdatePolicyBodySchema
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
References
Cdp
Client
Create
Policy
Body
Create
Policy
Body
Schema
Evm
Server
Account
Evm
Smart
Account
Policy
Update
Policy
Body
Update
Policy
Body
Schema
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/openapi-client.html">
Preparing search index...
The search index is not available
Documentation
Documentation
openapi-client
Module openapi-client
Type Aliases
CdpOpenApiClientType
Variables
CdpOpenApiClient
OpenApiEvmMethods
OpenApiPoliciesMethods
OpenApiSolanaMethods
References
AlreadyExistsErrorResponse
→
AlreadyExistsErrorResponse
BadGatewayErrorResponse
→
BadGatewayErrorResponse
createEvmAccount
→
createEvmAccount
CreateEvmAccountBody
→
CreateEvmAccountBody
CreateEvmAccountResult
→
CreateEvmAccountResult
createEvmSmartAccount
→
createEvmSmartAccount
CreateEvmSmartAccountBody
→
CreateEvmSmartAccountBody
CreateEvmSmartAccountResult
→
CreateEvmSmartAccountResult
createPolicy
→
createPolicy
CreatePolicyBody
→
CreatePolicyBody
CreatePolicyBodyScope
→
CreatePolicyBodyScope
CreatePolicyResult
→
CreatePolicyResult
createSolanaAccount
→
createSolanaAccount
CreateSolanaAccountBody
→
CreateSolanaAccountBody
CreateSolanaAccountResult
→
CreateSolanaAccountResult
deletePolicy
→
deletePolicy
DeletePolicyResult
→
DeletePolicyResult
EIP712Domain
→
EIP712Domain
EIP712Message
→
EIP712Message
EIP712MessageMessage
→
EIP712MessageMessage
EIP712Types
→
EIP712Types
Error
→
Error
ErrorType
→
ErrorType
EthValueCriterion
→
EthValueCriterion
EthValueCriterionOperator
→
EthValueCriterionOperator
EthValueCriterionType
→
EthValueCriterionType
EvmAccount
→
EvmAccount
EvmAddressCriterion
→
EvmAddressCriterion
EvmAddressCriterionOperator
→
EvmAddressCriterionOperator
EvmAddressCriterionType
→
EvmAddressCriterionType
EvmCall
→
EvmCall
EvmSmartAccount
→
EvmSmartAccount
EvmUserOperation
→
EvmUserOperation
EvmUserOperationNetwork
→
EvmUserOperationNetwork
EvmUserOperationStatus
→
EvmUserOperationStatus
getEvmAccount
→
getEvmAccount
getEvmAccountByName
→
getEvmAccountByName
GetEvmAccountByNameResult
→
GetEvmAccountByNameResult
GetEvmAccountResult
→
GetEvmAccountResult
getEvmSmartAccount
→
getEvmSmartAccount
GetEvmSmartAccountResult
→
GetEvmSmartAccountResult
getPolicyById
→
getPolicyById
GetPolicyByIdResult
→
GetPolicyByIdResult
getSolanaAccount
→
getSolanaAccount
getSolanaAccountByName
→
getSolanaAccountByName
GetSolanaAccountByNameResult
→
GetSolanaAccountByNameResult
GetSolanaAccountResult
→
GetSolanaAccountResult
getUserOperation
→
getUserOperation
GetUserOperationResult
→
GetUserOperationResult
IdempotencyErrorResponse
→
IdempotencyErrorResponse
IdempotencyKeyParameter
→
IdempotencyKeyParameter
InternalServerErrorResponse
→
InternalServerErrorResponse
listEvmAccounts
→
listEvmAccounts
ListEvmAccounts200
→
ListEvmAccounts200
ListEvmAccounts200AllOf
→
ListEvmAccounts200AllOf
ListEvmAccountsParams
→
ListEvmAccountsParams
ListEvmAccountsResult
→
ListEvmAccountsResult
listEvmSmartAccounts
→
listEvmSmartAccounts
ListEvmSmartAccounts200
→
ListEvmSmartAccounts200
ListEvmSmartAccounts200AllOf
→
ListEvmSmartAccounts200AllOf
ListEvmSmartAccountsParams
→
ListEvmSmartAccountsParams
ListEvmSmartAccountsResult
→
ListEvmSmartAccountsResult
listEvmTokenBalances
→
listEvmTokenBalances
ListEvmTokenBalances200
→
ListEvmTokenBalances200
ListEvmTokenBalances200AllOf
→
ListEvmTokenBalances200AllOf
ListEvmTokenBalancesNetwork
→
ListEvmTokenBalancesNetwork
ListEvmTokenBalancesParams
→
ListEvmTokenBalancesParams
ListEvmTokenBalancesResult
→
ListEvmTokenBalancesResult
listPolicies
→
listPolicies
ListPolicies200
→
ListPolicies200
ListPolicies200AllOf
→
ListPolicies200AllOf
ListPoliciesParams
→
ListPoliciesParams
ListPoliciesResult
→
ListPoliciesResult
ListPoliciesScope
→
ListPoliciesScope
ListResponse
→
ListResponse
listSolanaAccounts
→
listSolanaAccounts
ListSolanaAccounts200
→
ListSolanaAccounts200
ListSolanaAccounts200AllOf
→
ListSolanaAccounts200AllOf
ListSolanaAccountsParams
→
ListSolanaAccountsParams
ListSolanaAccountsResult
→
ListSolanaAccountsResult
Policy
→
Policy
PolicyScope
→
PolicyScope
prepareUserOperation
→
prepareUserOperation
PrepareUserOperationBody
→
PrepareUserOperationBody
PrepareUserOperationBodyNetwork
→
PrepareUserOperationBodyNetwork
PrepareUserOperationResult
→
PrepareUserOperationResult
requestEvmFaucet
→
requestEvmFaucet
RequestEvmFaucet200
→
RequestEvmFaucet200
RequestEvmFaucetBody
→
RequestEvmFaucetBody
RequestEvmFaucetBodyNetwork
→
RequestEvmFaucetBodyNetwork
RequestEvmFaucetBodyToken
→
RequestEvmFaucetBodyToken
RequestEvmFaucetResult
→
RequestEvmFaucetResult
requestSolanaFaucet
→
requestSolanaFaucet
RequestSolanaFaucet200
→
RequestSolanaFaucet200
RequestSolanaFaucetBody
→
RequestSolanaFaucetBody
RequestSolanaFaucetBodyToken
→
RequestSolanaFaucetBodyToken
RequestSolanaFaucetResult
→
RequestSolanaFaucetResult
Rule
→
Rule
RuleAction
→
RuleAction
RuleCriteria
→
RuleCriteria
RuleOperation
→
RuleOperation
sendEvmTransaction
→
sendEvmTransaction
SendEvmTransaction200
→
SendEvmTransaction200
SendEvmTransactionBody
→
SendEvmTransactionBody
SendEvmTransactionBodyNetwork
→
SendEvmTransactionBodyNetwork
SendEvmTransactionResult
→
SendEvmTransactionResult
sendUserOperation
→
sendUserOperation
SendUserOperationBody
→
SendUserOperationBody
SendUserOperationResult
→
SendUserOperationResult
ServiceUnavailableErrorResponse
→
ServiceUnavailableErrorResponse
signEvmHash
→
signEvmHash
SignEvmHash200
→
SignEvmHash200
SignEvmHashBody
→
SignEvmHashBody
SignEvmHashResult
→
SignEvmHashResult
signEvmMessage
→
signEvmMessage
SignEvmMessage200
→
SignEvmMessage200
SignEvmMessageBody
→
SignEvmMessageBody
SignEvmMessageResult
→
SignEvmMessageResult
signEvmTransaction
→
signEvmTransaction
SignEvmTransaction200
→
SignEvmTransaction200
SignEvmTransactionBody
→
SignEvmTransactionBody
SignEvmTransactionCriteria
→
SignEvmTransactionCriteria
SignEvmTransactionCriteriaItem
→
SignEvmTransactionCriteriaItem
SignEvmTransactionResult
→
SignEvmTransactionResult
signEvmTypedData
→
signEvmTypedData
SignEvmTypedData200
→
SignEvmTypedData200
SignEvmTypedDataResult
→
SignEvmTypedDataResult
signSolanaMessage
→
signSolanaMessage
SignSolanaMessage200
→
SignSolanaMessage200
SignSolanaMessageBody
→
SignSolanaMessageBody
SignSolanaMessageResult
→
SignSolanaMessageResult
signSolanaTransaction
→
signSolanaTransaction
SignSolanaTransaction200
→
SignSolanaTransaction200
SignSolanaTransactionBody
→
SignSolanaTransactionBody
SignSolanaTransactionResult
→
SignSolanaTransactionResult
SignSolTransactionCriteria
→
SignSolTransactionCriteria
SolAddressCriterion
→
SolAddressCriterion
SolAddressCriterionOperator
→
SolAddressCriterionOperator
SolAddressCriterionType
→
SolAddressCriterionType
SolanaAccount
→
SolanaAccount
Token
→
Token
TokenAmount
→
TokenAmount
TokenBalance
→
TokenBalance
updateEvmAccount
→
updateEvmAccount
UpdateEvmAccountBody
→
UpdateEvmAccountBody
UpdateEvmAccountResult
→
UpdateEvmAccountResult
updatePolicy
→
updatePolicy
UpdatePolicyBody
→
UpdatePolicyBody
UpdatePolicyResult
→
UpdatePolicyResult
updateSolanaAccount
→
updateSolanaAccount
UpdateSolanaAccountBody
→
UpdateSolanaAccountBody
UpdateSolanaAccountResult
→
UpdateSolanaAccountResult
XWalletAuthParameter
→
XWalletAuthParameter
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Type Aliases
Cdp
Open
Api
Client
Type
Variables
Cdp
Open
Api
Client
Open
Api
Evm
Methods
Open
Api
Policies
Methods
Open
Api
Solana
Methods
References
Already
Exists
Error
Response
Bad
Gateway
Error
Response
create
Evm
Account
Create
Evm
Account
Body
Create
Evm
Account
Result
create
Evm
Smart
Account
Create
Evm
Smart
Account
Body
Create
Evm
Smart
Account
Result
create
Policy
Create
Policy
Body
Create
Policy
Body
Scope
Create
Policy
Result
create
Solana
Account
Create
Solana
Account
Body
Create
Solana
Account
Result
delete
Policy
Delete
Policy
Result
EIP712
Domain
EIP712
Message
EIP712
Message
Message
EIP712
Types
Error
Error
Type
Eth
Value
Criterion
Eth
Value
Criterion
Operator
Eth
Value
Criterion
Type
Evm
Account
Evm
Address
Criterion
Evm
Address
Criterion
Operator
Evm
Address
Criterion
Type
Evm
Call
Evm
Smart
Account
Evm
User
Operation
Evm
User
Operation
Network
Evm
User
Operation
Status
get
Evm
Account
get
Evm
Account
By
Name
Get
Evm
Account
By
Name
Result
Get
Evm
Account
Result
get
Evm
Smart
Account
Get
Evm
Smart
Account
Result
get
Policy
By
Id
Get
Policy
By
Id
Result
get
Solana
Account
get
Solana
Account
By
Name
Get
Solana
Account
By
Name
Result
Get
Solana
Account
Result
get
User
Operation
Get
User
Operation
Result
Idempotency
Error
Response
Idempotency
Key
Parameter
Internal
Server
Error
Response
list
Evm
Accounts
List
Evm
Accounts200
List
Evm
Accounts200
All
Of
List
Evm
Accounts
Params
List
Evm
Accounts
Result
list
Evm
Smart
Accounts
List
Evm
Smart
Accounts200
List
Evm
Smart
Accounts200
All
Of
List
Evm
Smart
Accounts
Params
List
Evm
Smart
Accounts
Result
list
Evm
Token
Balances
List
Evm
Token
Balances200
List
Evm
Token
Balances200
All
Of
List
Evm
Token
Balances
Network
List
Evm
Token
Balances
Params
List
Evm
Token
Balances
Result
list
Policies
List
Policies200
List
Policies200
All
Of
List
Policies
Params
List
Policies
Result
List
Policies
Scope
List
Response
list
Solana
Accounts
List
Solana
Accounts200
List
Solana
Accounts200
All
Of
List
Solana
Accounts
Params
List
Solana
Accounts
Result
Policy
Policy
Scope
prepare
User
Operation
Prepare
User
Operation
Body
Prepare
User
Operation
Body
Network
Prepare
User
Operation
Result
request
Evm
Faucet
Request
Evm
Faucet200
Request
Evm
Faucet
Body
Request
Evm
Faucet
Body
Network
Request
Evm
Faucet
Body
Token
Request
Evm
Faucet
Result
request
Solana
Faucet
Request
Solana
Faucet200
Request
Solana
Faucet
Body
Request
Solana
Faucet
Body
Token
Request
Solana
Faucet
Result
Rule
Rule
Action
Rule
Criteria
Rule
Operation
send
Evm
Transaction
Send
Evm
Transaction200
Send
Evm
Transaction
Body
Send
Evm
Transaction
Body
Network
Send
Evm
Transaction
Result
send
User
Operation
Send
User
Operation
Body
Send
User
Operation
Result
Service
Unavailable
Error
Response
sign
Evm
Hash
Sign
Evm
Hash200
Sign
Evm
Hash
Body
Sign
Evm
Hash
Result
sign
Evm
Message
Sign
Evm
Message200
Sign
Evm
Message
Body
Sign
Evm
Message
Result
sign
Evm
Transaction
Sign
Evm
Transaction200
Sign
Evm
Transaction
Body
Sign
Evm
Transaction
Criteria
Sign
Evm
Transaction
Criteria
Item
Sign
Evm
Transaction
Result
sign
Evm
Typed
Data
Sign
Evm
Typed
Data200
Sign
Evm
Typed
Data
Result
sign
Solana
Message
Sign
Solana
Message200
Sign
Solana
Message
Body
Sign
Solana
Message
Result
sign
Solana
Transaction
Sign
Solana
Transaction200
Sign
Solana
Transaction
Body
Sign
Solana
Transaction
Result
Sign
Sol
Transaction
Criteria
Sol
Address
Criterion
Sol
Address
Criterion
Operator
Sol
Address
Criterion
Type
Solana
Account
Token
Token
Amount
Token
Balance
update
Evm
Account
Update
Evm
Account
Body
Update
Evm
Account
Result
update
Policy
Update
Policy
Body
Update
Policy
Result
update
Solana
Account
Update
Solana
Account
Body
Update
Solana
Account
Result
XWallet
Auth
Parameter
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/openapi-client_cdpApiClient.html">
Preparing search index...
The search index is not available
Documentation
Documentation
openapi-client/cdpApiClient
Module openapi-client/cdpApiClient
Type Aliases
CdpOptions
Functions
cdpApiClient
configure
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Type Aliases
Cdp
Options
Functions
cdp
Api
Client
configure
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/openapi-client_errors.html">
Preparing search index...
The search index is not available
Documentation
Documentation
openapi-client/errors
Module openapi-client/errors
Classes
APIError
UnknownApiError
UnknownError
Type Aliases
APIErrorType
HttpErrorType
Variables
HttpErrorType
Functions
isOpenAPIError
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Classes
APIError
Unknown
Api
Error
Unknown
Error
Type Aliases
APIError
Type
Http
Error
Type
Variables
Http
Error
Type
Functions
is
OpenAPIError
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/openapi-client_generated_coinbaseDeveloperPlatformAPIs.schemas.html">
Preparing search index...
The search index is not available
Documentation
Documentation
openapi-client/generated/coinbaseDeveloperPlatformAPIs.schemas
Module openapi-client/generated/coinbaseDeveloperPlatformAPIs.schemas
Interfaces
EIP712Domain
EIP712Message
EIP712Types
Error
EthValueCriterion
EvmAccount
EvmAddressCriterion
EvmCall
EvmSmartAccount
EvmUserOperation
ListResponse
Policy
Rule
SolAddressCriterion
SolanaAccount
Token
TokenAmount
TokenBalance
Type Aliases
AlreadyExistsErrorResponse
BadGatewayErrorResponse
CreateEvmAccountBody
CreateEvmSmartAccountBody
CreatePolicyBody
CreatePolicyBodyScope
CreateSolanaAccountBody
EIP712MessageMessage
ErrorType
EthValueCriterionOperator
EthValueCriterionType
EvmAddressCriterionOperator
EvmAddressCriterionType
EvmUserOperationNetwork
EvmUserOperationStatus
IdempotencyErrorResponse
IdempotencyKeyParameter
InternalServerErrorResponse
ListEvmAccounts200
ListEvmAccounts200AllOf
ListEvmAccountsParams
ListEvmSmartAccounts200
ListEvmSmartAccounts200AllOf
ListEvmSmartAccountsParams
ListEvmTokenBalances200
ListEvmTokenBalances200AllOf
ListEvmTokenBalancesNetwork
ListEvmTokenBalancesParams
ListPolicies200
ListPolicies200AllOf
ListPoliciesParams
ListPoliciesScope
ListSolanaAccounts200
ListSolanaAccounts200AllOf
ListSolanaAccountsParams
PolicyScope
PrepareUserOperationBody
PrepareUserOperationBodyNetwork
RequestEvmFaucet200
RequestEvmFaucetBody
RequestEvmFaucetBodyNetwork
RequestEvmFaucetBodyToken
RequestSolanaFaucet200
RequestSolanaFaucetBody
RequestSolanaFaucetBodyToken
RuleAction
RuleCriteria
RuleOperation
SendEvmTransaction200
SendEvmTransactionBody
SendEvmTransactionBodyNetwork
SendUserOperationBody
ServiceUnavailableErrorResponse
SignEvmHash200
SignEvmHashBody
SignEvmMessage200
SignEvmMessageBody
SignEvmTransaction200
SignEvmTransactionBody
SignEvmTransactionCriteria
SignEvmTransactionCriteriaItem
SignEvmTypedData200
SignSolanaMessage200
SignSolanaMessageBody
SignSolanaTransaction200
SignSolanaTransactionBody
SignSolTransactionCriteria
SolAddressCriterionOperator
SolAddressCriterionType
UpdateEvmAccountBody
UpdatePolicyBody
UpdateSolanaAccountBody
XWalletAuthParameter
Variables
CreatePolicyBodyScope
ErrorType
EthValueCriterionOperator
EthValueCriterionType
EvmAddressCriterionOperator
EvmAddressCriterionType
EvmUserOperationNetwork
EvmUserOperationStatus
ListEvmTokenBalancesNetwork
ListPoliciesScope
PolicyScope
PrepareUserOperationBodyNetwork
RequestEvmFaucetBodyNetwork
RequestEvmFaucetBodyToken
RequestSolanaFaucetBodyToken
RuleAction
RuleOperation
SendEvmTransactionBodyNetwork
SolAddressCriterionOperator
SolAddressCriterionType
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Interfaces
EIP712
Domain
EIP712
Message
EIP712
Types
Error
Eth
Value
Criterion
Evm
Account
Evm
Address
Criterion
Evm
Call
Evm
Smart
Account
Evm
User
Operation
List
Response
Policy
Rule
Sol
Address
Criterion
Solana
Account
Token
Token
Amount
Token
Balance
Type Aliases
Already
Exists
Error
Response
Bad
Gateway
Error
Response
Create
Evm
Account
Body
Create
Evm
Smart
Account
Body
Create
Policy
Body
Create
Policy
Body
Scope
Create
Solana
Account
Body
EIP712
Message
Message
Error
Type
Eth
Value
Criterion
Operator
Eth
Value
Criterion
Type
Evm
Address
Criterion
Operator
Evm
Address
Criterion
Type
Evm
User
Operation
Network
Evm
User
Operation
Status
Idempotency
Error
Response
Idempotency
Key
Parameter
Internal
Server
Error
Response
List
Evm
Accounts200
List
Evm
Accounts200
All
Of
List
Evm
Accounts
Params
List
Evm
Smart
Accounts200
List
Evm
Smart
Accounts200
All
Of
List
Evm
Smart
Accounts
Params
List
Evm
Token
Balances200
List
Evm
Token
Balances200
All
Of
List
Evm
Token
Balances
Network
List
Evm
Token
Balances
Params
List
Policies200
List
Policies200
All
Of
List
Policies
Params
List
Policies
Scope
List
Solana
Accounts200
List
Solana
Accounts200
All
Of
List
Solana
Accounts
Params
Policy
Scope
Prepare
User
Operation
Body
Prepare
User
Operation
Body
Network
Request
Evm
Faucet200
Request
Evm
Faucet
Body
Request
Evm
Faucet
Body
Network
Request
Evm
Faucet
Body
Token
Request
Solana
Faucet200
Request
Solana
Faucet
Body
Request
Solana
Faucet
Body
Token
Rule
Action
Rule
Criteria
Rule
Operation
Send
Evm
Transaction200
Send
Evm
Transaction
Body
Send
Evm
Transaction
Body
Network
Send
User
Operation
Body
Service
Unavailable
Error
Response
Sign
Evm
Hash200
Sign
Evm
Hash
Body
Sign
Evm
Message200
Sign
Evm
Message
Body
Sign
Evm
Transaction200
Sign
Evm
Transaction
Body
Sign
Evm
Transaction
Criteria
Sign
Evm
Transaction
Criteria
Item
Sign
Evm
Typed
Data200
Sign
Solana
Message200
Sign
Solana
Message
Body
Sign
Solana
Transaction200
Sign
Solana
Transaction
Body
Sign
Sol
Transaction
Criteria
Sol
Address
Criterion
Operator
Sol
Address
Criterion
Type
Update
Evm
Account
Body
Update
Policy
Body
Update
Solana
Account
Body
XWallet
Auth
Parameter
Variables
Create
Policy
Body
Scope
Error
Type
Eth
Value
Criterion
Operator
Eth
Value
Criterion
Type
Evm
Address
Criterion
Operator
Evm
Address
Criterion
Type
Evm
User
Operation
Network
Evm
User
Operation
Status
List
Evm
Token
Balances
Network
List
Policies
Scope
Policy
Scope
Prepare
User
Operation
Body
Network
Request
Evm
Faucet
Body
Network
Request
Evm
Faucet
Body
Token
Request
Solana
Faucet
Body
Token
Rule
Action
Rule
Operation
Send
Evm
Transaction
Body
Network
Sol
Address
Criterion
Operator
Sol
Address
Criterion
Type
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/openapi-client_generated_evm-accounts_evm-accounts.html">
Preparing search index...
The search index is not available
Documentation
Documentation
openapi-client/generated/evm-accounts/evm-accounts
Module openapi-client/generated/evm-accounts/evm-accounts
Type Aliases
CreateEvmAccountResult
GetEvmAccountByNameResult
GetEvmAccountResult
ListEvmAccountsResult
SendEvmTransactionResult
SignEvmHashResult
SignEvmMessageResult
SignEvmTransactionResult
SignEvmTypedDataResult
UpdateEvmAccountResult
Functions
createEvmAccount
Create an EVM account
getEvmAccount
Get an EVM account by address
getEvmAccountByName
Get an EVM account by name
listEvmAccounts
List EVM accounts
sendEvmTransaction
Send a transaction
signEvmHash
Sign a hash
signEvmMessage
Sign an EIP-191 message
signEvmTransaction
Sign a transaction
signEvmTypedData
Sign EIP-712 typed data
updateEvmAccount
Update an EVM account
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Type Aliases
Create
Evm
Account
Result
Get
Evm
Account
By
Name
Result
Get
Evm
Account
Result
List
Evm
Accounts
Result
Send
Evm
Transaction
Result
Sign
Evm
Hash
Result
Sign
Evm
Message
Result
Sign
Evm
Transaction
Result
Sign
Evm
Typed
Data
Result
Update
Evm
Account
Result
Functions
create
Evm
Account
get
Evm
Account
get
Evm
Account
By
Name
list
Evm
Accounts
send
Evm
Transaction
sign
Evm
Hash
sign
Evm
Message
sign
Evm
Transaction
sign
Evm
Typed
Data
update
Evm
Account
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/openapi-client_generated_evm-accounts_evm-accounts.msw.html">
Preparing search index...
The search index is not available
Documentation
Documentation
openapi-client/generated/evm-accounts/evm-accounts.msw
Module openapi-client/generated/evm-accounts/evm-accounts.msw
Functions
getCreateEvmAccountMockHandler
getCreateEvmAccountResponseMock
getEvmAccountsMock
getGetEvmAccountByNameMockHandler
getGetEvmAccountByNameResponseMock
getGetEvmAccountMockHandler
getGetEvmAccountResponseMock
getListEvmAccountsMockHandler
getListEvmAccountsResponseMock
getSendEvmTransactionMockHandler
getSendEvmTransactionResponseMock
getSignEvmHashMockHandler
getSignEvmHashResponseMock
getSignEvmMessageMockHandler
getSignEvmMessageResponseMock
getSignEvmTransactionMockHandler
getSignEvmTransactionResponseMock
getSignEvmTypedDataMockHandler
getSignEvmTypedDataResponseMock
getUpdateEvmAccountMockHandler
getUpdateEvmAccountResponseMock
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Functions
get
Create
Evm
Account
Mock
Handler
get
Create
Evm
Account
Response
Mock
get
Evm
Accounts
Mock
get
Get
Evm
Account
By
Name
Mock
Handler
get
Get
Evm
Account
By
Name
Response
Mock
get
Get
Evm
Account
Mock
Handler
get
Get
Evm
Account
Response
Mock
get
List
Evm
Accounts
Mock
Handler
get
List
Evm
Accounts
Response
Mock
get
Send
Evm
Transaction
Mock
Handler
get
Send
Evm
Transaction
Response
Mock
get
Sign
Evm
Hash
Mock
Handler
get
Sign
Evm
Hash
Response
Mock
get
Sign
Evm
Message
Mock
Handler
get
Sign
Evm
Message
Response
Mock
get
Sign
Evm
Transaction
Mock
Handler
get
Sign
Evm
Transaction
Response
Mock
get
Sign
Evm
Typed
Data
Mock
Handler
get
Sign
Evm
Typed
Data
Response
Mock
get
Update
Evm
Account
Mock
Handler
get
Update
Evm
Account
Response
Mock
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/openapi-client_generated_evm-smart-accounts_evm-smart-accounts.html">
Preparing search index...
The search index is not available
Documentation
Documentation
openapi-client/generated/evm-smart-accounts/evm-smart-accounts
Module openapi-client/generated/evm-smart-accounts/evm-smart-accounts
Type Aliases
CreateEvmSmartAccountResult
GetEvmSmartAccountResult
GetUserOperationResult
ListEvmSmartAccountsResult
PrepareUserOperationResult
SendUserOperationResult
Functions
createEvmSmartAccount
Create a Smart Account
getEvmSmartAccount
Get a Smart Account by address
getUserOperation
Get a user operation
listEvmSmartAccounts
List Smart Accounts
prepareUserOperation
Prepare a user operation
sendUserOperation
Send a user operation
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Type Aliases
Create
Evm
Smart
Account
Result
Get
Evm
Smart
Account
Result
Get
User
Operation
Result
List
Evm
Smart
Accounts
Result
Prepare
User
Operation
Result
Send
User
Operation
Result
Functions
create
Evm
Smart
Account
get
Evm
Smart
Account
get
User
Operation
list
Evm
Smart
Accounts
prepare
User
Operation
send
User
Operation
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/openapi-client_generated_evm-smart-accounts_evm-smart-accounts.msw.html">
Preparing search index...
The search index is not available
Documentation
Documentation
openapi-client/generated/evm-smart-accounts/evm-smart-accounts.msw
Module openapi-client/generated/evm-smart-accounts/evm-smart-accounts.msw
Functions
getCreateEvmSmartAccountMockHandler
getCreateEvmSmartAccountResponseMock
getEvmSmartAccountsMock
getGetEvmSmartAccountMockHandler
getGetEvmSmartAccountResponseMock
getGetUserOperationMockHandler
getGetUserOperationResponseMock
getListEvmSmartAccountsMockHandler
getListEvmSmartAccountsResponseMock
getPrepareUserOperationMockHandler
getPrepareUserOperationResponseMock
getSendUserOperationMockHandler
getSendUserOperationResponseMock
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Functions
get
Create
Evm
Smart
Account
Mock
Handler
get
Create
Evm
Smart
Account
Response
Mock
get
Evm
Smart
Accounts
Mock
get
Get
Evm
Smart
Account
Mock
Handler
get
Get
Evm
Smart
Account
Response
Mock
get
Get
User
Operation
Mock
Handler
get
Get
User
Operation
Response
Mock
get
List
Evm
Smart
Accounts
Mock
Handler
get
List
Evm
Smart
Accounts
Response
Mock
get
Prepare
User
Operation
Mock
Handler
get
Prepare
User
Operation
Response
Mock
get
Send
User
Operation
Mock
Handler
get
Send
User
Operation
Response
Mock
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/openapi-client_generated_evm-token-balances_evm-token-balances.html">
Preparing search index...
The search index is not available
Documentation
Documentation
openapi-client/generated/evm-token-balances/evm-token-balances
Module openapi-client/generated/evm-token-balances/evm-token-balances
Type Aliases
ListEvmTokenBalancesResult
Functions
listEvmTokenBalances
List EVM token balances
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Type Aliases
List
Evm
Token
Balances
Result
Functions
list
Evm
Token
Balances
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/openapi-client_generated_evm-token-balances_evm-token-balances.msw.html">
Preparing search index...
The search index is not available
Documentation
Documentation
openapi-client/generated/evm-token-balances/evm-token-balances.msw
Module openapi-client/generated/evm-token-balances/evm-token-balances.msw
Functions
getEvmTokenBalancesMock
getListEvmTokenBalancesMockHandler
getListEvmTokenBalancesResponseMock
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Functions
get
Evm
Token
Balances
Mock
get
List
Evm
Token
Balances
Mock
Handler
get
List
Evm
Token
Balances
Response
Mock
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/openapi-client_generated_faucets_faucets.html">
Preparing search index...
The search index is not available
Documentation
Documentation
openapi-client/generated/faucets/faucets
Module openapi-client/generated/faucets/faucets
Type Aliases
RequestEvmFaucetResult
RequestSolanaFaucetResult
Functions
requestEvmFaucet
Request funds on EVM test networks
requestSolanaFaucet
Request funds on Solana devnet
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Type Aliases
Request
Evm
Faucet
Result
Request
Solana
Faucet
Result
Functions
request
Evm
Faucet
request
Solana
Faucet
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/openapi-client_generated_faucets_faucets.msw.html">
Preparing search index...
The search index is not available
Documentation
Documentation
openapi-client/generated/faucets/faucets.msw
Module openapi-client/generated/faucets/faucets.msw
Functions
getFaucetsMock
getRequestEvmFaucetMockHandler
getRequestEvmFaucetResponseMock
getRequestSolanaFaucetMockHandler
getRequestSolanaFaucetResponseMock
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Functions
get
Faucets
Mock
get
Request
Evm
Faucet
Mock
Handler
get
Request
Evm
Faucet
Response
Mock
get
Request
Solana
Faucet
Mock
Handler
get
Request
Solana
Faucet
Response
Mock
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/openapi-client_generated_index.msw.html">
Preparing search index...
The search index is not available
Documentation
Documentation
openapi-client/generated/index.msw
Module openapi-client/generated/index.msw
References
getCreateEvmAccountMockHandler
→
getCreateEvmAccountMockHandler
getCreateEvmAccountResponseMock
→
getCreateEvmAccountResponseMock
getCreateEvmSmartAccountMockHandler
→
getCreateEvmSmartAccountMockHandler
getCreateEvmSmartAccountResponseMock
→
getCreateEvmSmartAccountResponseMock
getCreatePolicyMockHandler
→
getCreatePolicyMockHandler
getCreatePolicyResponseEthValueCriterionMock
→
getCreatePolicyResponseEthValueCriterionMock
getCreatePolicyResponseEvmAddressCriterionMock
→
getCreatePolicyResponseEvmAddressCriterionMock
getCreatePolicyResponseMock
→
getCreatePolicyResponseMock
getCreatePolicyResponseSolAddressCriterionMock
→
getCreatePolicyResponseSolAddressCriterionMock
getCreateSolanaAccountMockHandler
→
getCreateSolanaAccountMockHandler
getCreateSolanaAccountResponseMock
→
getCreateSolanaAccountResponseMock
getDeletePolicyMockHandler
→
getDeletePolicyMockHandler
getEvmAccountsMock
→
getEvmAccountsMock
getEvmSmartAccountsMock
→
getEvmSmartAccountsMock
getEvmTokenBalancesMock
→
getEvmTokenBalancesMock
getFaucetsMock
→
getFaucetsMock
getGetEvmAccountByNameMockHandler
→
getGetEvmAccountByNameMockHandler
getGetEvmAccountByNameResponseMock
→
getGetEvmAccountByNameResponseMock
getGetEvmAccountMockHandler
→
getGetEvmAccountMockHandler
getGetEvmAccountResponseMock
→
getGetEvmAccountResponseMock
getGetEvmSmartAccountMockHandler
→
getGetEvmSmartAccountMockHandler
getGetEvmSmartAccountResponseMock
→
getGetEvmSmartAccountResponseMock
getGetPolicyByIdMockHandler
→
getGetPolicyByIdMockHandler
getGetPolicyByIdResponseEthValueCriterionMock
→
getGetPolicyByIdResponseEthValueCriterionMock
getGetPolicyByIdResponseEvmAddressCriterionMock
→
getGetPolicyByIdResponseEvmAddressCriterionMock
getGetPolicyByIdResponseMock
→
getGetPolicyByIdResponseMock
getGetPolicyByIdResponseSolAddressCriterionMock
→
getGetPolicyByIdResponseSolAddressCriterionMock
getGetSolanaAccountByNameMockHandler
→
getGetSolanaAccountByNameMockHandler
getGetSolanaAccountByNameResponseMock
→
getGetSolanaAccountByNameResponseMock
getGetSolanaAccountMockHandler
→
getGetSolanaAccountMockHandler
getGetSolanaAccountResponseMock
→
getGetSolanaAccountResponseMock
getGetUserOperationMockHandler
→
getGetUserOperationMockHandler
getGetUserOperationResponseMock
→
getGetUserOperationResponseMock
getListEvmAccountsMockHandler
→
getListEvmAccountsMockHandler
getListEvmAccountsResponseMock
→
getListEvmAccountsResponseMock
getListEvmSmartAccountsMockHandler
→
getListEvmSmartAccountsMockHandler
getListEvmSmartAccountsResponseMock
→
getListEvmSmartAccountsResponseMock
getListEvmTokenBalancesMockHandler
→
getListEvmTokenBalancesMockHandler
getListEvmTokenBalancesResponseMock
→
getListEvmTokenBalancesResponseMock
getListPoliciesMockHandler
→
getListPoliciesMockHandler
getListPoliciesResponseEthValueCriterionMock
→
getListPoliciesResponseEthValueCriterionMock
getListPoliciesResponseEvmAddressCriterionMock
→
getListPoliciesResponseEvmAddressCriterionMock
getListPoliciesResponseMock
→
getListPoliciesResponseMock
getListPoliciesResponseSolAddressCriterionMock
→
getListPoliciesResponseSolAddressCriterionMock
getListSolanaAccountsMockHandler
→
getListSolanaAccountsMockHandler
getListSolanaAccountsResponseMock
→
getListSolanaAccountsResponseMock
getPolicyEngineMock
→
getPolicyEngineMock
getPrepareUserOperationMockHandler
→
getPrepareUserOperationMockHandler
getPrepareUserOperationResponseMock
→
getPrepareUserOperationResponseMock
getRequestEvmFaucetMockHandler
→
getRequestEvmFaucetMockHandler
getRequestEvmFaucetResponseMock
→
getRequestEvmFaucetResponseMock
getRequestSolanaFaucetMockHandler
→
getRequestSolanaFaucetMockHandler
getRequestSolanaFaucetResponseMock
→
getRequestSolanaFaucetResponseMock
getSendEvmTransactionMockHandler
→
getSendEvmTransactionMockHandler
getSendEvmTransactionResponseMock
→
getSendEvmTransactionResponseMock
getSendUserOperationMockHandler
→
getSendUserOperationMockHandler
getSendUserOperationResponseMock
→
getSendUserOperationResponseMock
getSignEvmHashMockHandler
→
getSignEvmHashMockHandler
getSignEvmHashResponseMock
→
getSignEvmHashResponseMock
getSignEvmMessageMockHandler
→
getSignEvmMessageMockHandler
getSignEvmMessageResponseMock
→
getSignEvmMessageResponseMock
getSignEvmTransactionMockHandler
→
getSignEvmTransactionMockHandler
getSignEvmTransactionResponseMock
→
getSignEvmTransactionResponseMock
getSignEvmTypedDataMockHandler
→
getSignEvmTypedDataMockHandler
getSignEvmTypedDataResponseMock
→
getSignEvmTypedDataResponseMock
getSignSolanaMessageMockHandler
→
getSignSolanaMessageMockHandler
getSignSolanaMessageResponseMock
→
getSignSolanaMessageResponseMock
getSignSolanaTransactionMockHandler
→
getSignSolanaTransactionMockHandler
getSignSolanaTransactionResponseMock
→
getSignSolanaTransactionResponseMock
getSolanaAccountsMock
→
getSolanaAccountsMock
getUpdateEvmAccountMockHandler
→
getUpdateEvmAccountMockHandler
getUpdateEvmAccountResponseMock
→
getUpdateEvmAccountResponseMock
getUpdatePolicyMockHandler
→
getUpdatePolicyMockHandler
getUpdatePolicyResponseEthValueCriterionMock
→
getUpdatePolicyResponseEthValueCriterionMock
getUpdatePolicyResponseEvmAddressCriterionMock
→
getUpdatePolicyResponseEvmAddressCriterionMock
getUpdatePolicyResponseMock
→
getUpdatePolicyResponseMock
getUpdatePolicyResponseSolAddressCriterionMock
→
getUpdatePolicyResponseSolAddressCriterionMock
getUpdateSolanaAccountMockHandler
→
getUpdateSolanaAccountMockHandler
getUpdateSolanaAccountResponseMock
→
getUpdateSolanaAccountResponseMock
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
References
get
Create
Evm
Account
Mock
Handler
get
Create
Evm
Account
Response
Mock
get
Create
Evm
Smart
Account
Mock
Handler
get
Create
Evm
Smart
Account
Response
Mock
get
Create
Policy
Mock
Handler
get
Create
Policy
Response
Eth
Value
Criterion
Mock
get
Create
Policy
Response
Evm
Address
Criterion
Mock
get
Create
Policy
Response
Mock
get
Create
Policy
Response
Sol
Address
Criterion
Mock
get
Create
Solana
Account
Mock
Handler
get
Create
Solana
Account
Response
Mock
get
Delete
Policy
Mock
Handler
get
Evm
Accounts
Mock
get
Evm
Smart
Accounts
Mock
get
Evm
Token
Balances
Mock
get
Faucets
Mock
get
Get
Evm
Account
By
Name
Mock
Handler
get
Get
Evm
Account
By
Name
Response
Mock
get
Get
Evm
Account
Mock
Handler
get
Get
Evm
Account
Response
Mock
get
Get
Evm
Smart
Account
Mock
Handler
get
Get
Evm
Smart
Account
Response
Mock
get
Get
Policy
By
Id
Mock
Handler
get
Get
Policy
By
Id
Response
Eth
Value
Criterion
Mock
get
Get
Policy
By
Id
Response
Evm
Address
Criterion
Mock
get
Get
Policy
By
Id
Response
Mock
get
Get
Policy
By
Id
Response
Sol
Address
Criterion
Mock
get
Get
Solana
Account
By
Name
Mock
Handler
get
Get
Solana
Account
By
Name
Response
Mock
get
Get
Solana
Account
Mock
Handler
get
Get
Solana
Account
Response
Mock
get
Get
User
Operation
Mock
Handler
get
Get
User
Operation
Response
Mock
get
List
Evm
Accounts
Mock
Handler
get
List
Evm
Accounts
Response
Mock
get
List
Evm
Smart
Accounts
Mock
Handler
get
List
Evm
Smart
Accounts
Response
Mock
get
List
Evm
Token
Balances
Mock
Handler
get
List
Evm
Token
Balances
Response
Mock
get
List
Policies
Mock
Handler
get
List
Policies
Response
Eth
Value
Criterion
Mock
get
List
Policies
Response
Evm
Address
Criterion
Mock
get
List
Policies
Response
Mock
get
List
Policies
Response
Sol
Address
Criterion
Mock
get
List
Solana
Accounts
Mock
Handler
get
List
Solana
Accounts
Response
Mock
get
Policy
Engine
Mock
get
Prepare
User
Operation
Mock
Handler
get
Prepare
User
Operation
Response
Mock
get
Request
Evm
Faucet
Mock
Handler
get
Request
Evm
Faucet
Response
Mock
get
Request
Solana
Faucet
Mock
Handler
get
Request
Solana
Faucet
Response
Mock
get
Send
Evm
Transaction
Mock
Handler
get
Send
Evm
Transaction
Response
Mock
get
Send
User
Operation
Mock
Handler
get
Send
User
Operation
Response
Mock
get
Sign
Evm
Hash
Mock
Handler
get
Sign
Evm
Hash
Response
Mock
get
Sign
Evm
Message
Mock
Handler
get
Sign
Evm
Message
Response
Mock
get
Sign
Evm
Transaction
Mock
Handler
get
Sign
Evm
Transaction
Response
Mock
get
Sign
Evm
Typed
Data
Mock
Handler
get
Sign
Evm
Typed
Data
Response
Mock
get
Sign
Solana
Message
Mock
Handler
get
Sign
Solana
Message
Response
Mock
get
Sign
Solana
Transaction
Mock
Handler
get
Sign
Solana
Transaction
Response
Mock
get
Solana
Accounts
Mock
get
Update
Evm
Account
Mock
Handler
get
Update
Evm
Account
Response
Mock
get
Update
Policy
Mock
Handler
get
Update
Policy
Response
Eth
Value
Criterion
Mock
get
Update
Policy
Response
Evm
Address
Criterion
Mock
get
Update
Policy
Response
Mock
get
Update
Policy
Response
Sol
Address
Criterion
Mock
get
Update
Solana
Account
Mock
Handler
get
Update
Solana
Account
Response
Mock
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/openapi-client_generated_policy-engine_policy-engine.html">
Preparing search index...
The search index is not available
Documentation
Documentation
openapi-client/generated/policy-engine/policy-engine
Module openapi-client/generated/policy-engine/policy-engine
Type Aliases
CreatePolicyResult
DeletePolicyResult
GetPolicyByIdResult
ListPoliciesResult
UpdatePolicyResult
Functions
createPolicy
Create a policy
deletePolicy
Delete a policy
getPolicyById
Get a policy by ID
listPolicies
List policies
updatePolicy
Update a policy
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Type Aliases
Create
Policy
Result
Delete
Policy
Result
Get
Policy
By
Id
Result
List
Policies
Result
Update
Policy
Result
Functions
create
Policy
delete
Policy
get
Policy
By
Id
list
Policies
update
Policy
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/openapi-client_generated_policy-engine_policy-engine.msw.html">
Preparing search index...
The search index is not available
Documentation
Documentation
openapi-client/generated/policy-engine/policy-engine.msw
Module openapi-client/generated/policy-engine/policy-engine.msw
Functions
getCreatePolicyMockHandler
getCreatePolicyResponseEthValueCriterionMock
getCreatePolicyResponseEvmAddressCriterionMock
getCreatePolicyResponseMock
getCreatePolicyResponseSolAddressCriterionMock
getDeletePolicyMockHandler
getGetPolicyByIdMockHandler
getGetPolicyByIdResponseEthValueCriterionMock
getGetPolicyByIdResponseEvmAddressCriterionMock
getGetPolicyByIdResponseMock
getGetPolicyByIdResponseSolAddressCriterionMock
getListPoliciesMockHandler
getListPoliciesResponseEthValueCriterionMock
getListPoliciesResponseEvmAddressCriterionMock
getListPoliciesResponseMock
getListPoliciesResponseSolAddressCriterionMock
getPolicyEngineMock
getUpdatePolicyMockHandler
getUpdatePolicyResponseEthValueCriterionMock
getUpdatePolicyResponseEvmAddressCriterionMock
getUpdatePolicyResponseMock
getUpdatePolicyResponseSolAddressCriterionMock
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Functions
get
Create
Policy
Mock
Handler
get
Create
Policy
Response
Eth
Value
Criterion
Mock
get
Create
Policy
Response
Evm
Address
Criterion
Mock
get
Create
Policy
Response
Mock
get
Create
Policy
Response
Sol
Address
Criterion
Mock
get
Delete
Policy
Mock
Handler
get
Get
Policy
By
Id
Mock
Handler
get
Get
Policy
By
Id
Response
Eth
Value
Criterion
Mock
get
Get
Policy
By
Id
Response
Evm
Address
Criterion
Mock
get
Get
Policy
By
Id
Response
Mock
get
Get
Policy
By
Id
Response
Sol
Address
Criterion
Mock
get
List
Policies
Mock
Handler
get
List
Policies
Response
Eth
Value
Criterion
Mock
get
List
Policies
Response
Evm
Address
Criterion
Mock
get
List
Policies
Response
Mock
get
List
Policies
Response
Sol
Address
Criterion
Mock
get
Policy
Engine
Mock
get
Update
Policy
Mock
Handler
get
Update
Policy
Response
Eth
Value
Criterion
Mock
get
Update
Policy
Response
Evm
Address
Criterion
Mock
get
Update
Policy
Response
Mock
get
Update
Policy
Response
Sol
Address
Criterion
Mock
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/openapi-client_generated_solana-accounts_solana-accounts.html">
Preparing search index...
The search index is not available
Documentation
Documentation
openapi-client/generated/solana-accounts/solana-accounts
Module openapi-client/generated/solana-accounts/solana-accounts
Type Aliases
CreateSolanaAccountResult
GetSolanaAccountByNameResult
GetSolanaAccountResult
ListSolanaAccountsResult
SignSolanaMessageResult
SignSolanaTransactionResult
UpdateSolanaAccountResult
Functions
createSolanaAccount
Create a Solana account
getSolanaAccount
Get a Solana account by address
getSolanaAccountByName
Get a Solana account by name
listSolanaAccounts
List Solana accounts or get account by name
signSolanaMessage
Sign a message
signSolanaTransaction
Sign a transaction
updateSolanaAccount
Update a Solana account
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Type Aliases
Create
Solana
Account
Result
Get
Solana
Account
By
Name
Result
Get
Solana
Account
Result
List
Solana
Accounts
Result
Sign
Solana
Message
Result
Sign
Solana
Transaction
Result
Update
Solana
Account
Result
Functions
create
Solana
Account
get
Solana
Account
get
Solana
Account
By
Name
list
Solana
Accounts
sign
Solana
Message
sign
Solana
Transaction
update
Solana
Account
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/openapi-client_generated_solana-accounts_solana-accounts.msw.html">
Preparing search index...
The search index is not available
Documentation
Documentation
openapi-client/generated/solana-accounts/solana-accounts.msw
Module openapi-client/generated/solana-accounts/solana-accounts.msw
Functions
getCreateSolanaAccountMockHandler
getCreateSolanaAccountResponseMock
getGetSolanaAccountByNameMockHandler
getGetSolanaAccountByNameResponseMock
getGetSolanaAccountMockHandler
getGetSolanaAccountResponseMock
getListSolanaAccountsMockHandler
getListSolanaAccountsResponseMock
getSignSolanaMessageMockHandler
getSignSolanaMessageResponseMock
getSignSolanaTransactionMockHandler
getSignSolanaTransactionResponseMock
getSolanaAccountsMock
getUpdateSolanaAccountMockHandler
getUpdateSolanaAccountResponseMock
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Functions
get
Create
Solana
Account
Mock
Handler
get
Create
Solana
Account
Response
Mock
get
Get
Solana
Account
By
Name
Mock
Handler
get
Get
Solana
Account
By
Name
Response
Mock
get
Get
Solana
Account
Mock
Handler
get
Get
Solana
Account
Response
Mock
get
List
Solana
Accounts
Mock
Handler
get
List
Solana
Accounts
Response
Mock
get
Sign
Solana
Message
Mock
Handler
get
Sign
Solana
Message
Response
Mock
get
Sign
Solana
Transaction
Mock
Handler
get
Sign
Solana
Transaction
Response
Mock
get
Solana
Accounts
Mock
get
Update
Solana
Account
Mock
Handler
get
Update
Solana
Account
Response
Mock
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/policies_schema.html">
Preparing search index...
The search index is not available
Documentation
Documentation
policies/schema
Module policies/schema
Type Aliases
Action
CreatePolicyBody
EthValueCriterion
EthValueOperator
EvmAddressCriterion
EvmAddressOperator
EvmOperation
PolicyScope
Rule
SignEvmTransactionCriteria
SignEvmTransactionRule
SignSolTransactionCriteria
SignSolTransactionRule
SolAddressCriterion
SolAddressOperator
SolOperation
UpdatePolicyBody
Variables
ActionEnum
CreatePolicyBodySchema
EthValueCriterionSchema
EthValueOperatorEnum
EvmAddressCriterionSchema
EvmAddressOperatorEnum
EvmOperationEnum
PolicyScopeEnum
RuleSchema
SignEvmTransactionCriteriaSchema
SignEvmTransactionRuleSchema
SignSolTransactionCriteriaSchema
SignSolTransactionRuleSchema
SolAddressCriterionSchema
SolAddressOperatorEnum
SolOperationEnum
UpdatePolicyBodySchema
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Type Aliases
Action
Create
Policy
Body
Eth
Value
Criterion
Eth
Value
Operator
Evm
Address
Criterion
Evm
Address
Operator
Evm
Operation
Policy
Scope
Rule
Sign
Evm
Transaction
Criteria
Sign
Evm
Transaction
Rule
Sign
Sol
Transaction
Criteria
Sign
Sol
Transaction
Rule
Sol
Address
Criterion
Sol
Address
Operator
Sol
Operation
Update
Policy
Body
Variables
Action
Enum
Create
Policy
Body
Schema
Eth
Value
Criterion
Schema
Eth
Value
Operator
Enum
Evm
Address
Criterion
Schema
Evm
Address
Operator
Enum
Evm
Operation
Enum
Policy
Scope
Enum
Rule
Schema
Sign
Evm
Transaction
Criteria
Schema
Sign
Evm
Transaction
Rule
Schema
Sign
Sol
Transaction
Criteria
Schema
Sign
Sol
Transaction
Rule
Schema
Sol
Address
Criterion
Schema
Sol
Address
Operator
Enum
Sol
Operation
Enum
Update
Policy
Body
Schema
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/policies_types.html">
Preparing search index...
The search index is not available
Documentation
Documentation
policies/types
Module policies/types
Type Aliases
Policy
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Type Aliases
Policy
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/types_calls.html">
Preparing search index...
The search index is not available
Documentation
Documentation
types/calls
Module types/calls
Type Aliases
Call
Calls
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Type Aliases
Call
Calls
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/types_contract.html">
Preparing search index...
The search index is not available
Documentation
Documentation
types/contract
Module types/contract
Type Aliases
ContractFunctionArgs
ContractFunctionName
ContractFunctionParameters
ExtractAbiFunctionForArgs
UnionWiden
Widen
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Type Aliases
Contract
Function
Args
Contract
Function
Name
Contract
Function
Parameters
Extract
Abi
Function
For
Args
Union
Widen
Widen
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/types_misc.html">
Preparing search index...
The search index is not available
Documentation
Documentation
types/misc
Module types/misc
Interfaces
EIP712Domain
EIP712Message
EIP712Types
Type Aliases
AccessList
Address
EIP712MessageMessage
Hash
Hex
TransactionRequestEIP1559
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Interfaces
EIP712
Domain
EIP712
Message
EIP712
Types
Type Aliases
Access
List
Address
EIP712
Message
Message
Hash
Hex
Transaction
RequestEIP1559
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/types_multicall.html">
Preparing search index...
The search index is not available
Documentation
Documentation
types/multicall
Module types/multicall
Type Aliases
GetMulticallContractParameters
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Type Aliases
Get
Multicall
Contract
Parameters
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/types_utils.html">
Preparing search index...
The search index is not available
Documentation
Documentation
types/utils
Module types/utils
Type Aliases
Assign
Evaluate
ExactPartial
ExactRequired
Filter
IsNarrowable
IsNever
IsUndefined
IsUnion
LooseOmit
MaybePartial
MaybePromise
MaybeRequired
Mutable
NoInfer
NoUndefined
Omit
OneOf
Or
PartialBy
Prettify
RequiredBy
Some
UnionEvaluate
UnionLooseOmit
UnionOmit
UnionPartialBy
UnionPick
UnionRequiredBy
UnionToTuple
ValueOf
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Type Aliases
Assign
Evaluate
Exact
Partial
Exact
Required
Filter
Is
Narrowable
Is
Never
Is
Undefined
Is
Union
Loose
Omit
Maybe
Partial
Maybe
Promise
Maybe
Required
Mutable
No
Infer
No
Undefined
Omit
One
Of
Or
Partial
By
Prettify
Required
By
Some
Union
Evaluate
Union
Loose
Omit
Union
Omit
Union
Partial
By
Union
Pick
Union
Required
By
Union
To
Tuple
Value
Of
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/utils_serializeTransaction.html">
Preparing search index...
The search index is not available
Documentation
Documentation
utils/serializeTransaction
Module utils/serializeTransaction
Functions
serializeEIP1559Transaction
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Functions
serializeEIP1559
Transaction
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/utils_wait.html">
Preparing search index...
The search index is not available
Documentation
Documentation
utils/wait
Module utils/wait
Type Aliases
WaitOptions
Functions
wait
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Type Aliases
Wait
Options
Functions
wait
Documentation
Loading...
Generated using
TypeDoc
</page>
<page url="https://coinbase.github.io/cdp-sdk/typescript/modules/version.html">
Preparing search index...
The search index is not available
Documentation
Documentation
version
Module version
Variables
version
Settings
Member Visibility
Protected
Inherited
External
Theme
OS
Light
Dark
On This Page
Variables
version
Documentation
Loading...
Generated using
TypeDoc
</page>
</source>