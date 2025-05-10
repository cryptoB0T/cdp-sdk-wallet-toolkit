
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
      
      try {
        const response = await fetch('/api/create-wallet', {
          method: 'POST',
        });
        
        if (!response.ok) {
          throw new Error('Failed to create wallet');
        }
        
        const data = await response.json();
        setAccount(data.account);
        setTxHash(data.transactionHash);
      } catch (err) {
        setError(err.message);
      }
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
