import React, { useState } from 'react';
import { parseEther, formatEther } from 'viem';

interface PolicyTesterProps {
  policyId: string;
  scope: 'project' | 'account';
  accountAddress?: string;
  maxEthValue: string; // In ETH
  allowedAddress: string;
}

export default function PolicyTester({
  policyId,
  scope,
  accountAddress,
  maxEthValue,
  allowedAddress
}: PolicyTesterProps) {
  const [amount, setAmount] = useState('0.5'); // Default to 0.5 ETH
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState('');
  
  // Convert ETH to Wei for comparison using viem's parseEther
  const maxWeiValue = parseEther(maxEthValue);
  const currentWeiValue = parseEther(amount || '0');
  const isOverLimit = currentWeiValue > maxWeiValue;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const testPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setTransactionHash('');

    try {
      // Convert ETH to Wei using viem's parseEther function
      const weiValue = parseEther(amount || '0').toString();
      
      const response = await fetch('/api/test-policy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          policyId,
          scope,
          accountAddress,
          to: allowedAddress,
          value: weiValue,
          data: '0x', // Empty data for a simple ETH transfer
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to test policy');
      }

      setResult(data);
      if (data.transactionHash) {
        setTransactionHash(data.transactionHash);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while testing the policy');
      console.error('Policy test error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto my-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Test Policy</h2>
      
      <div className="mb-4 p-3 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-800">
          This will test your policy by sending a transaction to the allowed address 
          ({allowedAddress.substring(0, 6)}...{allowedAddress.substring(38)}).
          <br /><br />
          <strong>Policy Limit:</strong> {maxEthValue} ETH
          <br />
          <strong>Scope:</strong> {scope}-level
          {scope === 'account' && accountAddress && (
            <>
              <br />
              <strong>Account:</strong> {accountAddress.substring(0, 6)}...{accountAddress.substring(38)}
            </>
          )}
        </p>
      </div>
      
      <form onSubmit={testPolicy}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="amount">
            Amount to Send (ETH)
          </label>
          <input
            type="number"
            id="amount"
            step="0.01"
            min="0"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              isOverLimit 
                ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                : 'border-green-300 focus:ring-green-500 bg-green-50'
            }`}
            value={amount}
            onChange={handleAmountChange}
            required
          />
          {isOverLimit ? (
            <p className="mt-1 text-sm text-red-600">
              This amount exceeds the policy limit of {maxEthValue} ETH and should be rejected.
            </p>
          ) : (
            <p className="mt-1 text-sm text-green-600">
              This amount is within the policy limit of {maxEthValue} ETH and should be accepted.
            </p>
          )}
        </div>

        <div className="flex space-x-4 mb-4">
          <button
            type="button"
            className="flex-1 bg-green-100 text-green-800 py-2 px-4 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            onClick={() => setAmount('0.5')} // Half of limit
          >
            Test Valid Amount
          </button>
          <button
            type="button"
            className="flex-1 bg-red-100 text-red-800 py-2 px-4 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            onClick={() => setAmount((parseFloat(maxEthValue) * 2).toString())} // Double the limit
          >
            Test Invalid Amount
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
          disabled={loading}
        >
          {loading ? 'Testing Policy...' : 'Test Transaction'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p className="font-medium">Error</p>
          <p>{error}</p>
          {error.includes('policy') && (
            <p className="mt-2 text-sm">
              This is expected if the transaction violates the policy rules.
            </p>
          )}
        </div>
      )}

      {result && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
          <p className="font-medium">Success!</p>
          <p>Transaction was accepted by the policy.</p>
          <pre className="mt-2 text-xs overflow-auto max-h-40">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {transactionHash && (
        <div className="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded-md">
          <p className="font-medium">Transaction Hash:</p>
          <p className="text-xs break-all">{transactionHash}</p>
          <a 
            href={`https://sepolia.basescan.org/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            View on Block Explorer
          </a>
        </div>
      )}
    </div>
  );
}
