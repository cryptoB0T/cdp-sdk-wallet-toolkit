Title: Security | Coinbase Developer Documentation

URL Source: https://docs.cdp.coinbase.com/wallet-api-v2/docs/security

Markdown Content:
Overview[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/security#overview "Direct link to Overview")
--------------------------------------------------------------------------------------------------------

The v2 Wallet API is secured by CDP's [**Trusted** Execution Environment](https://en.wikipedia.org/wiki/Trusted_execution_environment) (TEE), a highly isolated compute environment that is used for sensitive cryptographic operations such as private key generation and transaction signing.

The TEE is hosted on [AWS Nitro Enclaves](https://aws.amazon.com/ec2/nitro/nitro-enclaves/), an isolated, secure compute environment. The TEE has **no persistent storage**, **no interactive access**, and **no external networking**, ensuring that evan a root or admin user cannot access or SSH into the TEE.

All operations that take place in the TEE are not visible to CDP, AWS, or the outside world.

TEE architecture[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/security#tee-architecture "Direct link to TEE architecture")
--------------------------------------------------------------------------------------------------------------------------------

The following diagram demonstrates the architecture of the TEE:

![Image 1: CDP TEE Architecture](https://docs.cdp.coinbase.com/assets/images/tee-architecture-7deff371b49170cadb4a14cafb8116c4.png)

### How it works[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/security#how-it-works "Direct link to How it works")

1.  Incoming requests to the v2 Wallet API are authenticated with the developer's [Wallet Secret](https://docs.cdp.coinbase.com/wallet-api-v2/docs/security#wallet-secrets).
2.  After validating the request, it is forwarded to the TEE over [VSOCK](https://man7.org/linux/man-pages/man7/vsock.7.html), which provides the only source of data flow to and from the TEE.
3.  The TEE performs sensitive operations, including verifying the wallet authentication signature, private key generation, and transaction signing. Account private keys are encrypted and decrypted exclusively **within the enclave**, and **never leave the TEE**. An encrypted version of the private keys are stored in CDP's database and can only be accessed by the developer with the corresponding Wallet Secret.
4.  The resulting payload is sent back to the v2 Wallet API over VSOCK.
5.  The v2 Wallet API returns the result to the client.

Wallet Secrets[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/security#wallet-secrets "Direct link to Wallet Secrets")
--------------------------------------------------------------------------------------------------------------------------

Wallet Secrets are used to authenticate requests to the v2 Wallet API.

Wallet Secrets are asymmetric private keys that conform to [ECDSA](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.186-5.pdf#page=29), a cryptographic technique for creating and verifying digital signatures. They rely on the [**secp256r1**](https://www.secg.org/sec2-v2.pdf#page=13) elliptic curve (also known as P-256), making keys small, fast, and highly secure.

Read more about using Wallet Secrets in our [v2 API Reference documentation](https://docs.cdp.coinbase.com/api-v2/docs/authentication#wallet-secret).

Create a Wallet Secret

Configure your Wallet Secret in the [Wallet API](https://portal.cdp.coinbase.com/products/wallet-api) page of the CDP Portal.

### 2FA[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/security#2fa "Direct link to 2FA")

To increase security of your wallet, we recommend [enabling two-factor authentication](https://docs.cdp.coinbase.com/wallet-api-v2/docs/update-wallet-secret#2fa-management) (2FA).

We support physical security keys, passkeys, Google or Duo authentication apps, security push notifications, and even trusted contacts.

Warning

When enabling 2FA, it is highly advised you do not use SMS, and instead use a physical security key or other more secure methods.

### Lost access[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/security#lost-access "Direct link to Lost access")

If you lose access to your Wallet Secret, you can delete the old secret and generate a new one through the CDP Portal. See [Wallet Secret Rotation](https://docs.cdp.coinbase.com/wallet-api-v2/docs/update-wallet-secret) for more information on how to update your secret and manage two factor authentication.

What to read next[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/security#what-to-read-next "Direct link to What to read next")
--------------------------------------------------------------------------------------------------------------------------------

*   [v2 API Reference documentation](https://docs.cdp.coinbase.com/api-v2/docs/authentication)): Learn how to use Wallet Secrets to authenticate requests to the v2 Wallet API.
*   [v2 Wallet API Quickstart](https://docs.cdp.coinbase.com/wallet-api-v2/docs/quickstart): Learn how to use the v2 Wallet API to create a new wallet and perform transactions.
*   [Wallet Secret Rotation](https://docs.cdp.coinbase.com/wallet-api-v2/docs/update-wallet-secret): Learn how to update your Wallet Secret and manage two factor authentication.