import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface DonationPolicyCreatorProps {
  onClose: () => void;
  onSuccess: (policyId: string) => void;
}

interface Account {
  address: string;
  type: 'EVM' | 'SOLANA';
  createdAt?: string;
  updatedAt?: string;
  name?: string;
}

export default function DonationPolicyCreator({ onClose, onSuccess }: DonationPolicyCreatorProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [accountAddress, setAccountAddress] = useState('');
  const [donationPercentage, setDonationPercentage] = useState(1); // Default 1%
  const [donationAddress, setDonationAddress] = useState('');
  const [customAddress, setCustomAddress] = useState('');
  const [description, setDescription] = useState('Automatic Donation Policy');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Predefined donation addresses (could be loaded from a config)
  const predefinedDonations = [
    { name: 'Red Cross', address: '0x5a7749f83b81B301cAb5f48EB8516B986DAef23D' },
    { name: 'UNICEF', address: '0x4e5b2e1dc63f6b91cb6cd759936495434c7e972f' },
    { name: 'Ethereum Foundation', address: '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae' },
    { name: 'Custom Address', address: 'custom' }
  ];

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoadingAccounts(true);
    try {
      const response = await fetch('/api/list-all-accounts');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch accounts');
      }

      if (data.accounts && Array.isArray(data.accounts)) {
        // Filter to only show EVM accounts for now
        const evmAccounts = data.accounts.filter(account => account.type === 'EVM');
        setAccounts(evmAccounts);
      } else {
        console.warn('Accounts data is not an array:', data.accounts);
        setAccounts([]);
      }
    } catch (err) {
      console.error('Account fetch error:', err);
      setError('Failed to load accounts. Please try again.');
    } finally {
      setLoadingAccounts(false);
    }
  };

  const handleDonationAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setDonationAddress(value);
    if (value !== 'custom') {
      setCustomAddress('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate inputs
    if (!accountAddress) {
      setError('Please select an account');
      setLoading(false);
      return;
    }

    if (donationPercentage <= 0 || donationPercentage > 100) {
      setError('Donation percentage must be between 0 and 100');
      setLoading(false);
      return;
    }

    const finalDonationAddress = donationAddress === 'custom' 
      ? customAddress 
      : donationAddress;

    if (!finalDonationAddress || !finalDonationAddress.startsWith('0x')) {
      setError('Please enter a valid donation address');
      setLoading(false);
      return;
    }

    try {
      // Create the donation policy
      const response = await fetch('/api/create-donation-policy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountAddress,
          donationPercentage,
          donationAddress: finalDonationAddress,
          description
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create donation policy');
      }

      setSuccess(true);
      onSuccess(data.policyId);
    } catch (err) {
      console.error('Error creating donation policy:', err);
      setError(err.message || 'An error occurred while creating the donation policy');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Create Donation Policy</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Description */}
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
                Policy Description
              </label>
              <input
                type="text"
                id="description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Account Selection */}
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="accountAddress">
                Account
              </label>
              <div className="relative">
                {loadingAccounts && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                  </div>
                )}
                <select
                  id="accountAddress"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  value={accountAddress}
                  onChange={(e) => setAccountAddress(e.target.value)}
                  disabled={loadingAccounts}
                  required
                >
                  <option value="">Select an account</option>
                  {accounts.map((account) => (
                    <option key={account.address} value={account.address}>
                      {account.name || account.address}
                    </option>
                  ))}
                </select>
              </div>
              {accounts.length === 0 && !loadingAccounts && (
                <p className="mt-1 text-sm text-amber-600">
                  No accounts found. Please create an account first.
                </p>
              )}
            </div>

            {/* Donation Percentage */}
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="donationPercentage">
                Donation Percentage
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  id="donationPercentage"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={donationPercentage}
                  onChange={(e) => setDonationPercentage(Number(e.target.value))}
                  min="0.1"
                  max="100"
                  step="0.1"
                  required
                />
                <span className="ml-2 text-gray-700">%</span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                This percentage of each transaction will be automatically donated.
              </p>
            </div>

            {/* Donation Address */}
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="donationAddress">
                Donation Recipient
              </label>
              <select
                id="donationAddress"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                value={donationAddress}
                onChange={handleDonationAddressChange}
                required
              >
                <option value="">Select a recipient</option>
                {predefinedDonations.map((donation) => (
                  <option key={donation.address} value={donation.address}>
                    {donation.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Address Input */}
            {donationAddress === 'custom' && (
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="customAddress">
                  Custom Donation Address
                </label>
                <input
                  type="text"
                  id="customAddress"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  placeholder="0x..."
                  required
                />
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
              <p>Donation policy created successfully!</p>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Creating...
                </span>
              ) : (
                'Create Donation Policy'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
