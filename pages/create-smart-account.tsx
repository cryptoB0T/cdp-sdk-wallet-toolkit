
import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

const CreateSmartAccount: NextPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { address: connectedAddress, isConnected } = useAccount();

  useEffect(() => {
    // Fetch available accounts on component mount
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/list-accounts?type=EVM');
      if (!response.ok) throw new Error('Failed to fetch accounts');
      const data = await response.json();
      setAccounts(data.accounts || []);
    } catch (err) {
      console.error('Error fetching accounts:', err);
    }
  };

  const createSmartAccount = async (ownerAddress: string) => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/create-smart-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ownerAddress,
          network: 'base-sepolia'
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create smart account');
      }

      const data = await response.json();
      alert(`Smart account created successfully! Address: ${data.smartAccountAddress}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Smart Account</title>
        <meta name="description" content="Create Smart Account" />
      </Head>

      <div className="max-w-4xl mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Create Smart Account</h1>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 mb-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Select Owner Account</h2>
              
              {isConnected && (
                <div className="mb-4">
                  <button
                    onClick={() => createSmartAccount(connectedAddress)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                  >
                    Use Connected Wallet ({connectedAddress})
                  </button>
                </div>
              )}

              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Or Select Existing Account:</h3>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select an account</option>
                  {accounts.map((acc) => (
                    <option key={acc.address} value={acc.address}>
                      {acc.name} ({acc.address})
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => selectedAccount && createSmartAccount(selectedAccount)}
                  disabled={!selectedAccount || loading}
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Smart Account'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive rounded-md p-4">
            <p>{error}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateSmartAccount;
