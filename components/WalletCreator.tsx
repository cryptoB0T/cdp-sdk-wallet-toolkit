import { useState } from 'react';
import styles from '../styles/WalletCreator.module.css';

type WalletType = 'EVM' | 'SOLANA';
type EVMNetwork = 'base-sepolia' | 'base-mainnet';

export default function WalletCreator() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');
  const [walletType, setWalletType] = useState<WalletType>('EVM');
  const [evmNetwork, setEvmNetwork] = useState<EVMNetwork>('base-sepolia');
  const [accountName, setAccountName] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [smartAccountAddress, setSmartAccountAddress] = useState('');
  const [isCreatingSmartAccount, setIsCreatingSmartAccount] = useState(false);
  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);

  const sendTransaction = async () => {
    if (!fromAddress || !toAddress || !transferAmount) {
      setError('Please fill in all transfer details');
      return;
    }

    try {
      setIsTransferring(true);
      setError('');

      const response = await fetch('/api/send-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromAddress,
          toAddress,
          amount: transferAmount
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send transaction');

      setTxHash(data.transactionHash);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsTransferring(false);
    }
  };

  useEffect(() => {
    listAccounts();
  }, []);

  const listAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/list-accounts?type=${walletType}`);
      if (!response.ok) throw new Error('Failed to list accounts');
      const data = await response.json();
      setAccounts(data.accounts);
    } catch (err) {
      const errorMessage = err.message || 'Failed to list accounts';
      console.error('List accounts error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createWallet = async () => {
    if (!accountName.trim()) {
      setError('Please enter an account name');
      return;
    }
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/create-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          type: walletType, 
          name: accountName,
          network: walletType === 'EVM' ? evmNetwork : undefined 
        }),
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
          {walletType === 'EVM' && (
            <select 
              value={evmNetwork}
              onChange={(e) => setEvmNetwork(e.target.value as EVMNetwork)}
              className={styles.select}
            >
              <option value="base-sepolia">Base Sepolia</option>
              <option value="base-mainnet">Base Mainnet</option>
            </select>
          )}
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

      <div className={styles.inputGroup}>
        <input
          type="text"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          placeholder="Enter account name"
          className={styles.input}
        />
      </div>

      <div className={styles.buttonGroup}>
        <button 
          onClick={createWallet} 
          disabled={loading}
          className={styles.button}
        >
          {loading ? 'Creating...' : `Create New ${walletType} Wallet`}
        </button>

        <button 
          onClick={listAccounts} 
          disabled={loading}
          className={styles.button}
        >
          List Accounts
        </button>
      </div>

      {accounts.length > 0 && (
        <div className={styles.accountsList}>
          <h3>Your Accounts</h3>
          {accounts.map((acc, index) => (
            <div key={index} className={styles.accountItem}>
              <p><strong>Name:</strong> {acc.name}</p>
              <p><strong>Address:</strong> {acc.address}</p>
              <div className={styles.balances}>
                <p><strong>Balances:</strong></p>
                {acc.balances && acc.balances.length > 0 ? (
                  acc.balances.map((balance, idx) => (
                    <p key={idx}>
                      {balance.formattedAmount || balance.amount} {balance.currency}
                    </p>
                  ))
                ) : (
                  <p className={styles.noTokens}>No tokens found</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}

      {account && (
        <div className={styles.accountInfo}>
          <h3>{walletType} Wallet Created!</h3>
          <p>Address: {account.address}</p>
          <button 
            onClick={async () => {
              try {
                setIsCreatingSmartAccount(true);
                setError('');
                const response = await fetch('/api/create-smart-account', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    ownerAddress: account.address,
                    network: evmNetwork
                  }),
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Failed to create smart account');
                setSmartAccountAddress(data.smartAccountAddress);
              } catch (err) {
                setError(err.message);
                console.error('Smart account creation failed:', err);
              } finally {
                setIsCreatingSmartAccount(false);
              }
            }}
            disabled={isCreatingSmartAccount || !!smartAccountAddress}
            className={styles.button}
          >
            {isCreatingSmartAccount ? 'Creating Smart Account...' : 'Create Smart Account'}
          </button>
          {smartAccountAddress && (
            <p>Smart Account Address: {smartAccountAddress}</p>
          )}
        </div>
      )}

      <div className={styles.transferForm}>
        <h3>Transfer Funds</h3>
        <div className={styles.formGroup}>
          <label>From Address:</label>
          <select
            value={fromAddress}
            onChange={(e) => setFromAddress(e.target.value)}
            className={styles.select}
          >
            <option value="">Select From Address</option>
            {accounts.map((acc) => (
              <option key={acc.address} value={acc.address}>
                {acc.name} ({acc.address})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>To Address:</label>
          <select
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            className={styles.select}
          >
            <option value="">Select To Address</option>
            {accounts.map((acc) => (
              <option key={acc.address} value={acc.address}>
                {acc.name} ({acc.address})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Amount:</label>
          <input
            type="text"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            placeholder="Enter amount in ETH"
            className={styles.input}
          />
        </div>

        <button
          onClick={sendTransaction}
          disabled={isTransferring || !accounts.length}
          className={styles.button}
        >
          {isTransferring ? 'Transferring...' : 'Send Transaction'}
        </button>
      </div>

          {txHash && (
            <p>
              Transaction: <a 
                href={walletType === 'EVM' 
                  ? `https://sepolia.basescan.org/tx/${txHash}`
                  : `https://solscan.io/tx/${txHash}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on {walletType === 'EVM' ? 'BaseScan' : 'Solscan'}
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}