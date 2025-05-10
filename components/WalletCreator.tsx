
import { useState } from 'react';
import styles from '../styles/WalletCreator.module.css';

type WalletType = 'EVM' | 'SOLANA';

export default function WalletCreator() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');
  const [walletType, setWalletType] = useState<WalletType>('EVM');

  const createWallet = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/create-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: walletType }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create wallet');
      }
      
      const data = await response.json();
      setAccount(data.account);
      setTxHash(data.transactionHash);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Create Wallet</h2>
      
      <div className={styles.walletTypeSelector}>
        <label>Select Wallet Type:</label>
        <div className={styles.radioGroup}>
          <label>
            <input
              type="radio"
              value="EVM"
              checked={walletType === 'EVM'}
              onChange={(e) => setWalletType(e.target.value as WalletType)}
            />
            EVM (Ethereum, Base, etc.)
          </label>
          <label>
            <input
              type="radio"
              value="SOLANA"
              checked={walletType === 'SOLANA'}
              onChange={(e) => setWalletType(e.target.value as WalletType)}
            />
            Solana
          </label>
        </div>
      </div>

      <button 
        onClick={createWallet} 
        disabled={loading}
        className={styles.button}
      >
        {loading ? 'Creating...' : `Create New ${walletType} Wallet`}
      </button>

      {error && <p className={styles.error}>{error}</p>}

      {account && (
        <div className={styles.accountInfo}>
          <h3>{walletType} Wallet Created!</h3>
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
