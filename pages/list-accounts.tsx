
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from 'react';

const ListAccounts: NextPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [walletType, setWalletType] = useState<'EVM' | 'SOLANA'>('EVM');

  useEffect(() => {
    listAccounts();
  }, [walletType]);

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

  return (
    <div className={styles.container}>
      <Head>
        <title>List Accounts</title>
        <meta name="description" content="List Web3 Accounts" />
      </Head>

      <main className={styles.main}>
        <nav className={styles.nav}>
          <Link href="/">Home</Link> |
          <Link href="/create-account">Create Account</Link> |
          <Link href="/transfer-funds">Transfer Funds</Link>
        </nav>

        <h1 className={styles.title}>Your Accounts</h1>

        <div className={styles.walletTypeSelector}>
          <label>Select Account Type:</label>
          <div className={styles.radioGroup}>
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

        <button 
          onClick={listAccounts} 
          disabled={loading}
          className={styles.button}
        >
          {loading ? 'Loading...' : 'Refresh Accounts'}
        </button>

        {error && <p className={styles.error}>{error}</p>}

        {accounts.length > 0 ? (
          <div className={styles.accountsList}>
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
        ) : (
          <p>No accounts found</p>
        )}
      </main>
    </div>
  );
};

export default ListAccounts;
