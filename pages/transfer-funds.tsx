
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
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
    <>
      <Head>
        <title>Transfer Funds</title>
        <meta name="description" content="Transfer Funds Between Accounts" />
      </Head>

      <div className="max-w-4xl mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Transfer Funds</h1>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Send Transaction</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">From Address:</label>
              <select
                value={fromAddress}
                onChange={(e) => setFromAddress(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select From Address</option>
                {accounts.map((acc) => (
                  <option key={acc.address} value={acc.address}>
                    {acc.name} ({acc.address.substring(0, 6)}...{acc.address.substring(acc.address.length - 4)})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">To Address:</label>
              <select
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select To Address</option>
                {accounts.map((acc) => (
                  <option key={acc.address} value={acc.address}>
                    {acc.name} ({acc.address.substring(0, 6)}...{acc.address.substring(acc.address.length - 4)})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Amount:</label>
              <input
                type="text"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="Enter amount in ETH"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <button
              onClick={sendTransaction}
              disabled={isTransferring || !accounts.length}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full mt-2"
            >
              {isTransferring ? 'Transferring...' : 'Send Transaction'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive rounded-md p-4 mb-6">
            <p>{error}</p>
          </div>
        )}

        {txHash && (
          <div className="rounded-lg border border-green-500 bg-green-50 dark:bg-green-950/20 p-6 text-card-foreground shadow-sm">
            <p>
              <span className="font-medium">Transaction:</span>{' '}
              <a 
                href={`https://sepolia.basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View on BaseScan
              </a>
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default TransferFunds;
