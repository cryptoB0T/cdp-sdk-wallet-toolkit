import React, { useState } from 'react';
import PolicyTester from './PolicyTester';

export default function PolicyCreator() {
  const [scope, setScope] = useState<'project' | 'account'>('project');
  const [accountAddress, setAccountAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTester, setShowTester] = useState(false);

  // Hardcoded policy values
  const maxEthValue = '1';
  const allowedAddress = '0x000000000000000000000000000000000000dEaD';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setShowTester(false);

    try {
      const response = await fetch('/api/create-policy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scope,
          accountAddress: scope === 'account' ? accountAddress : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create policy');
      }

      setResult(data);
      setShowTester(true);
    } catch (err) {
      setError(err.message || 'An error occurred while creating the policy');
      console.error('Policy creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto my-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Policy</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Policy Scope</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-5 w-5 text-blue-600"
                  checked={scope === 'project'}
                  onChange={() => setScope('project')}
                />
                <span className="ml-2 text-gray-700">Project-level</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-5 w-5 text-blue-600"
                  checked={scope === 'account'}
                  onChange={() => setScope('account')}
                />
                <span className="ml-2 text-gray-700">Account-level</span>
              </label>
            </div>
          </div>

          {scope === 'account' && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="accountAddress">
                Account Address
              </label>
              <input
                type="text"
                id="accountAddress"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={accountAddress}
                onChange={(e) => setAccountAddress(e.target.value)}
                placeholder="0x..."
                required
              />
            </div>
          )}

          <div className="policy-details mb-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Policy Details (Hardcoded)</h3>
            <div className="bg-gray-100 p-3 rounded-md text-sm">
              <p><strong>Description:</strong> {scope === 'project' ? 'Project-wide' : 'Account'} Allowlist Policy</p>
              <p><strong>Action:</strong> accept</p>
              <p><strong>Operation:</strong> signEvmTransaction</p>
              <p><strong>Criteria:</strong></p>
              <ul className="list-disc pl-5">
                <li>ETH Value ≤ {maxEthValue} ETH</li>
                <li>To Address: {allowedAddress}</li>
              </ul>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            disabled={loading || (scope === 'account' && !accountAddress)}
          >
            {loading ? 'Creating Policy...' : 'Create Policy'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
            <p className="font-medium">Success!</p>
            <pre className="mt-2 text-xs overflow-auto max-h-40">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {showTester && result && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Test Your Policy</h2>
          <p className="text-center mb-6 text-gray-600">
            Now you can test your policy by sending transactions with different amounts.
            <br />
            Transactions above 1 ETH should be rejected, while those below should be accepted.
          </p>
          <PolicyTester 
            policyId={result.policyId}
            scope={scope}
            accountAddress={scope === 'account' ? accountAddress : undefined}
            maxEthValue={maxEthValue}
            allowedAddress={allowedAddress}
          />
        </div>
      )}
    </div>
  );
}
