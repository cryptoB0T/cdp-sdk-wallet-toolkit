
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { useState } from 'react';

const CreateAccount: NextPage = () => {
  const [walletType, setWalletType] = useState<'EVM' | 'SOLANA'>('EVM');
  const [evmNetwork, setEvmNetwork] = useState<'base-sepolia' | 'base-mainnet'>('base-sepolia');
  const [accountName, setAccountName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [account, setAccount] = useState(null);
  const [txHash, setTxHash] = useState('');

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
      <Head>
        <title>Create Account</title>
        <meta name="description" content="Create Web3 Account" />
      </Head>

      <main className={styles.main}>
        <nav className={styles.nav}>
          <Link href="/">Home</Link> |
          <Link href="/list-accounts">List Accounts</Link> |
          <Link href="/transfer-funds">Transfer Funds</Link>
        </nav>

        <h1 className={styles.title}>Create New Account</h1>

        <div className={styles.walletTypeSelector}>
          <label>Select Account Type:</label>
          <div className={styles.radioGroup}>
            {walletType === 'EVM' && (
              <select 
                value={evmNetwork}
                onChange={(e) => setEvmNetwork(e.target.value as 'base-sepolia' | 'base-mainnet')}
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
                onChange={(e) => setWalletType(e.target.value as 'EVM' | 'SOLANA')}
              />
              EVM (Ethereum, Base, etc.)
            </label>
            <label>
              <input
                type="radio"
                value="SOLANA"
                checked={walletType === 'SOLANA'}
                onChange={(e) => setWalletType(e.target.value as 'EVM' | 'SOLANA')}
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

        <button 
          onClick={createWallet} 
          disabled={loading}
          className={styles.button}
        >
          {loading ? 'Creating...' : `Create New ${walletType} Account`}
        </button>

        {error && <p className={styles.error}>{error}</p>}

        {account && (
          <div className={styles.accountInfo}>
            <h3>{walletType} Account Created!</h3>
            <p>Address: {account.address}</p>
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
      </main>
    </div>
  );
};

export default CreateAccount;
