
import { useState } from 'react';
import { CdpClient } from "@coinbase/cdp-sdk";
import { createWalletClient, http, createPublicClient, parseEther } from "viem";
import { toAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import styles from '../styles/WalletCreator.module.css';

export default function WalletCreator() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');

  const createWallet = async () => {
    try {
      setLoading(true);
      setError('');
      
      const cdp = new CdpClient({
        apiKeyId: process.env.NEXT_PUBLIC_CDP_API_KEY_ID,
        apiKeySecret: process.env.NEXT_PUBLIC_CDP_API_KEY_SECRET,
        walletSecret: process.env.NEXT_PUBLIC_CDP_WALLET_SECRET,
      });
      const newAccount = await cdp.evm.createAccount();
      setAccount(newAccount);

      const walletClient = createWalletClient({
        account: toAccount(newAccount),
        chain: baseSepolia,
        transport: http(),
      });

      const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http(),
      });

      // Request testnet ETH
      const { transactionHash } = await cdp.evm.requestFaucet({
        address: newAccount.address,
        network: "base-sepolia",
        token: "eth",
      });

      await publicClient.waitForTransactionReceipt({
        hash: transactionHash,
      });

      setTxHash(transactionHash);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Create Wallet</h2>
      <button 
        onClick={createWallet} 
        disabled={loading}
        className={styles.button}
      >
        {loading ? 'Creating...' : 'Create New Wallet'}
      </button>

      {error && <p className={styles.error}>{error}</p>}

      {account && (
        <div className={styles.accountInfo}>
          <h3>Wallet Created!</h3>
          <p>Address: {account.address}</p>
          {txHash && (
            <p>
              Transaction: <a 
                href={`https://sepolia.basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on BaseScan
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
