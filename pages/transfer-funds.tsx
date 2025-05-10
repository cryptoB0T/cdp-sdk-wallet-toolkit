
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from 'react';

const TransferFunds: NextPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [txHash, setTxHash] = useState('');

  useEffect(() => {
    listAccounts();
  }, []);

  const listAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/list-accounts?type=EVM`);
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
    } catch (err) {
      setError(err.message);
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Transfer Funds</title>
        <meta name="description" content="Transfer Funds Between Accounts" />
      </Head>

      <main className={styles.main}>
        <nav className={styles.nav}>
          <Link href="/">Home</Link> |
          <Link href="/create-account">Create Account</Link> |
          <Link href="/list-accounts">List Accounts</Link>
        </nav>

        <h1 className={styles.title}>Transfer Funds</h1>

        <div className={styles.transferForm}>
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

          {error && <p className={styles.error}>{error}</p>}

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
      </main>
    </div>
  );
};

export default TransferFunds;
