Title: Rotate your Wallet Secret | Coinbase Developer Documentation

URL Source: https://docs.cdp.coinbase.com/wallet-api-v2/docs/update-wallet-secret

Markdown Content:
Overview[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/update-wallet-secret#overview "Direct link to Overview")
--------------------------------------------------------------------------------------------------------------------

CDP Wallets are secured by a [Wallet Secret](https://docs.cdp.coinbase.com/wallet-api-v2/docs/security#wallet-secret), which can only be accessed by the wallet owner/developer. Wallet Secrets are asymmetric key pairs used to authenticate with a [Trusted Execution Environment](https://docs.cdp.coinbase.com/wallet-api-v2/docs/security). If you lose your Wallet Secret, or you suspect it has been compromised, it is crucial to rotate it promptly to ensure safety of your funds. This action can be performed via the CDP portal.

Rotate your secret[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/update-wallet-secret#rotate-your-secret "Direct link to Rotate your secret")
--------------------------------------------------------------------------------------------------------------------------------

Warning

Once you complete this process, your old Wallet Secret will immediately become invalid and you will no longer be able to use it to authenticate.

1.  Navigate to the [CDP Portal](https://portal.cdp.coinbase.com/products/wallet-api) and access the Wallet API for your project.
    
2.  Under **Configuration**, you should see when your current **Wallet Secret** was generated. Click the **Generate new secret** button to rotate your secret.
    
    ![Image 1: Generate new secret](https://docs.cdp.coinbase.com/assets/images/wallet-recovery-generate-new-secret-c457d09b9543045f39d0b49d11b76770.png)
    
3.  A modal will appear prompting you to complete 2-step verification. Click **Complete** to receive a verification code.
    
    ![Image 2: Enable 2FA](https://docs.cdp.coinbase.com/assets/images/wallet-recovery-2-step-verification-a4bead8888e4ae9948c0ee8b3330a08d.png)
    
    Info
    
    If you lost access to your 2FA method or never set it up, skip to the [2FA management](https://docs.cdp.coinbase.com/wallet-api-v2/docs/update-wallet-secret#2fa-management) section to enable it for your account.
    
4.  Enter the verification code to complete the process.
    
5.  A modal will appear confirming your request to delete the existing secret. Type `delete secret` and click the **Delete and generate new secret** button.
    
    ![Image 3: Delete secret](https://docs.cdp.coinbase.com/assets/images/wallet-recovery-delete-701d20b044324f6c0b265125473c5d8d.png)
    
6.  A new secret will be generated and displayed in the modal.
    
    The secret will be automatically downloaded, but ensure you save it in a secure location. You will not be able to access the secret again without repeating this recovery process.
    

2FA management[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/update-wallet-secret#2fa-management "Direct link to 2FA management")
--------------------------------------------------------------------------------------------------------------------------------

For better security posture, you should have enabled two-factor authentication (2FA) when you created your wallet.

If you need to change or enable 2FA for your account:

1.  Navigate to the [Security dashboard](https://accounts.coinbase.com/security/settings).
    
2.  Under the **2-step verification** tab, you can add additional 2FA methods or enable/disable current methods.
    
    ![Image 4: Security settings](https://docs.cdp.coinbase.com/assets/images/wallet-recovery-settings-0b2bc92ca37c2202f1e727e70e0b8ff7.png)
    
3.  If you lost access to your existing 2FA method, you can verify your identity by clicking **Get started** at the bottom under **Lost access to your 2-step verification?**
    
    ![Image 5: Lost access](https://docs.cdp.coinbase.com/assets/images/wallet-recovery-lost-access-c36e7232f5840d69d6d986a82efad26d.png)
    

What to read next[](https://docs.cdp.coinbase.com/wallet-api-v2/docs/update-wallet-secret#what-to-read-next "Direct link to What to read next")
--------------------------------------------------------------------------------------------------------------------------------

*   [**Wallet API v2 Security**](https://docs.cdp.coinbase.com/wallet-api-v2/docs/security): Learn more about security features and architecture.