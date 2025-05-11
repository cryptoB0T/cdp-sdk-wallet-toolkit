
import { useState, useEffect } from 'react';
import Head from 'next/head';

interface SmartAccount {
  address: string;
  owners: { address: string }[];
}

export default function ListSmartAccounts() {
  const [accounts, setAccounts] = useState<SmartAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSmartAccounts();
  }, []);

  const fetchSmartAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/list-smart-accounts');
      if (!response.ok) throw new Error('Failed to fetch smart accounts');
      const data = await response.json();
      setAccounts(data.accounts || []);
    } catch (err: any) {
      console.error('List smart accounts error:', err);
      setError(err.message || 'Failed to fetch smart accounts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>List Smart Accounts</title>
        <meta name="description" content="List Smart Accounts" />
      </Head>

      <div className="max-w-4xl mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Smart Accounts</h1>

        {loading && (
          <div className="text-center py-4">
            <p>Loading smart accounts...</p>
          </div>
        )}

        {error && (
          <div className="bg-destructive/15 text-destructive rounded-md p-4 mb-6">
            <p>{error}</p>
          </div>
        )}

        {accounts.length > 0 ? (
          <div className="space-y-4">
            {accounts.map((account, index) => (
              <div key={index} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground break-all">
                    <span className="font-medium">Smart Account Address:</span> {account.address}
                  </p>
                  <p className="text-sm text-muted-foreground break-all">
                    <span className="font-medium">Owner Address:</span> {account.owners[0]?.address}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card/50 text-card-foreground p-6 text-center">
            <p className="text-muted-foreground">No smart accounts found</p>
          </div>
        )}
      </div>
    </>
  );
}
