
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect, useCallback } from 'react';

const ListAccounts: NextPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [smartAccounts, setSmartAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSmartAccounts = async () => {
    try {
      const response = await fetch('/api/list-smart-accounts');
      if (!response.ok) throw new Error('Failed to fetch smart accounts');
      const data = await response.json();
      setSmartAccounts(data.accounts || []);
    } catch (err) {
      console.error('List smart accounts error:', err);
    }
  };
  const [walletType, setWalletType] = useState<'EVM' | 'SOLANA'>('EVM');

  const listAccounts = useCallback(async () => {
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
  }, [walletType]);

  useEffect(() => {
    listAccounts();
    fetchSmartAccounts();
  }, [listAccounts]);

  return (
    <>
      <Head>
        <title>List Accounts</title>
        <meta name="description" content="List Web3 Accounts" />
      </Head>

      <div className="max-w-4xl mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Your Accounts</h1>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Account Type</h2>
          <div className="space-y-4">
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

            <button 
              onClick={listAccounts} 
              disabled={loading}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              {loading ? 'Loading...' : 'Refresh Accounts'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive rounded-md p-4 mb-6">
            <p>{error}</p>
          </div>
        )}

        {accounts.length > 0 ? (
          <div className="space-y-4">
            {accounts.map((acc, index) => (
              <div key={index} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{acc.name}</h3>
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/create-smart-account', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                              ownerAddress: acc.address,
                              network: 'base-sepolia'
                            }),
                          });
                          const data = await response.json();
                          if (!response.ok) throw new Error(data.error || 'Failed to create smart account');
                          alert(`Smart account created! Address: ${data.smartAccountAddress}`);
                        } catch (err: any) {
                          alert('Failed to create smart account: ' + err.message);
                        }
                      }}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                    >
                      Create Smart Account
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground break-all"><span className="font-medium">Address:</span> {acc.address}</p>
                  
                  {smartAccounts.filter(sa => sa.owners[0]?.address === acc.address).length > 0 && (
                    <div className="mt-4 border-t pt-4">
                      <h4 className="font-medium mb-2">Smart Accounts:</h4>
                      <div className="space-y-2">
                        {smartAccounts
                          .filter(sa => sa.owners[0]?.address === acc.address)
                          .map((sa, idx) => (
                            <div key={idx} className="text-sm text-muted-foreground">
                              <span className="font-medium">Address:</span> {sa.address}
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )}
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Balances:</h4>
                    {acc.balances && acc.balances.length > 0 ? (
                      <div className="space-y-1">
                        {acc.balances.map((balance, idx) => (
                          <div key={idx} className="flex items-center justify-between py-1 border-b border-border/30 last:border-0">
                            <span>{balance.currency}</span>
                            <span className="font-medium">{balance.formattedAmount || balance.amount}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No tokens found</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card/50 text-card-foreground p-6 text-center">
            <p className="text-muted-foreground">No accounts found</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ListAccounts;
