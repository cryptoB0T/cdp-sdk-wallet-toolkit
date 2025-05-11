
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
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

      // Using the direct API endpoint that uses environment variables
      const response = await fetch('/api/create-wallet-direct', {
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
    <>
      <Head>
        <title>Create Account</title>
        <meta name="description" content="Create Web3 Account" />
      </Head>

      <div className="max-w-4xl mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Create New Account</h1>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Account Type</h2>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="EVM"
                    checked={walletType === 'EVM'}
                    onChange={(e) => setWalletType(e.target.value as 'EVM' | 'SOLANA')}
                    className="h-4 w-4 text-primary"
                  />
                  <span>EVM (Ethereum, Base, etc.)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="SOLANA"
                    checked={walletType === 'SOLANA'}
                    onChange={(e) => setWalletType(e.target.value as 'EVM' | 'SOLANA')}
                    className="h-4 w-4 text-primary"
                  />
                  <span>Solana</span>
                </label>
              </div>
              
              {walletType === 'EVM' && (
                <div className="mt-2">
                  <label className="block text-sm font-medium mb-1">Network:</label>
                  <select 
                    value={evmNetwork}
                    onChange={(e) => setEvmNetwork(e.target.value as 'base-sepolia' | 'base-mainnet')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="base-sepolia">Base Sepolia</option>
                    <option value="base-mainnet">Base Mainnet</option>
                  </select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Account Name:</label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Enter account name"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <button 
              onClick={createWallet} 
              disabled={loading}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
            >
              {loading ? 'Creating...' : `Create New ${walletType} Account`}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive rounded-md p-4 mb-6">
            <p>{error}</p>
          </div>
        )}

        {account && (
          <div className="rounded-lg border border-green-500 bg-green-50 dark:bg-green-950/20 p-6 text-card-foreground shadow-sm">
            <h3 className="text-xl font-semibold mb-2">{walletType} Account Created!</h3>
            <p className="mb-2"><span className="font-medium">Address:</span> {account.address}</p>
            {txHash && (
              <p>
                <span className="font-medium">Transaction:</span>{' '}
                <a 
                  href={walletType === 'EVM' 
                    ? `https://sepolia.basescan.org/tx/${txHash}`
                    : `https://solscan.io/tx/${txHash}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View on {walletType === 'EVM' ? 'BaseScan' : 'Solscan'}
                </a>
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CreateAccount;
