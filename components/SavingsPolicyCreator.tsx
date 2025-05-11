import React, { useState, useEffect } from 'react';
import { Loader2, PlusCircle, MinusCircle } from 'lucide-react';

interface SavingsPolicyCreatorProps {
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

// Transaction categories for filtering
const TRANSACTION_CATEGORIES = [
  { id: 'shopping', name: 'Shopping' },
  { id: 'dining', name: 'Restaurants & Dining' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'travel', name: 'Travel' },
  { id: 'utilities', name: 'Utilities' },
  { id: 'subscriptions', name: 'Subscriptions' },
  { id: 'other', name: 'Other' }
];

export default function SavingsPolicyCreator({ onClose, onSuccess }: SavingsPolicyCreatorProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [sourceAccountAddress, setSourceAccountAddress] = useState('');
  const [savingsAccountAddress, setSavingsAccountAddress] = useState('');
  const [savingsPercentage, setSavingsPercentage] = useState(0.1); // Default 0.1% (10 basis points)
  const [description, setDescription] = useState('Automated Savings Policy');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Filter options
  const [useFilters, setUseFilters] = useState(false);
  const [filterType, setFilterType] = useState<'categories' | 'addresses'>('categories');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [merchantAddresses, setMerchantAddresses] = useState<string[]>(['']);

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

  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleAddMerchantAddress = () => {
    setMerchantAddresses([...merchantAddresses, '']);
  };

  const handleRemoveMerchantAddress = (index: number) => {
    const newAddresses = [...merchantAddresses];
    newAddresses.splice(index, 1);
    setMerchantAddresses(newAddresses);
  };

  const handleMerchantAddressChange = (index: number, value: string) => {
    const newAddresses = [...merchantAddresses];
    newAddresses[index] = value;
    setMerchantAddresses(newAddresses);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate inputs
    if (!sourceAccountAddress) {
      setError('Please select a source account');
      setLoading(false);
      return;
    }

    if (!savingsAccountAddress) {
      setError('Please select a savings account');
      setLoading(false);
      return;
    }

    if (sourceAccountAddress === savingsAccountAddress) {
      setError('Source and savings accounts must be different');
      setLoading(false);
      return;
    }

    if (savingsPercentage <= 0 || savingsPercentage > 100) {
      setError('Savings percentage must be between 0 and 100');
      setLoading(false);
      return;
    }

    // Validate merchant addresses if using address filters
    if (useFilters && filterType === 'addresses') {
      const validAddresses = merchantAddresses.filter(addr => addr && addr.startsWith('0x'));
      if (validAddresses.length === 0) {
        setError('Please enter at least one valid merchant address');
        setLoading(false);
        return;
      }
      // Remove empty addresses
      setMerchantAddresses(validAddresses);
    }

    // Validate categories if using category filters
    if (useFilters && filterType === 'categories' && selectedCategories.length === 0) {
      setError('Please select at least one transaction category');
      setLoading(false);
      return;
    }

    try {
      // Create the savings policy
      const response = await fetch('/api/create-savings-policy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceAccountAddress,
          savingsAccountAddress,
          savingsPercentage,
          description,
          filters: useFilters ? {
            type: filterType,
            categories: filterType === 'categories' ? selectedCategories : undefined,
            addresses: filterType === 'addresses' ? merchantAddresses : undefined
          } : undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create savings policy');
      }

      setSuccess(true);
      onSuccess(data.policyId);
    } catch (err) {
      console.error('Error creating savings policy:', err);
      setError(err.message || 'An error occurred while creating the savings policy');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Create Automated Savings Policy</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
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

            {/* Source Account Selection */}
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="sourceAccountAddress">
                Source Account (account making transactions)
              </label>
              <div className="relative">
                {loadingAccounts && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                  </div>
                )}
                <select
                  id="sourceAccountAddress"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  value={sourceAccountAddress}
                  onChange={(e) => setSourceAccountAddress(e.target.value)}
                  disabled={loadingAccounts}
                  required
                >
                  <option value="">Select source account</option>
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

            {/* Savings Account Selection */}
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="savingsAccountAddress">
                Savings Account (where savings will be deposited)
              </label>
              <div className="relative">
                {loadingAccounts && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                  </div>
                )}
                <select
                  id="savingsAccountAddress"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  value={savingsAccountAddress}
                  onChange={(e) => setSavingsAccountAddress(e.target.value)}
                  disabled={loadingAccounts}
                  required
                >
                  <option value="">Select savings account</option>
                  {accounts
                    .filter(account => account.address !== sourceAccountAddress)
                    .map((account) => (
                      <option key={account.address} value={account.address}>
                        {account.name || account.address}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Savings Percentage */}
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="savingsPercentage">
                Savings Percentage
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  id="savingsPercentage"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={savingsPercentage}
                  onChange={(e) => setSavingsPercentage(Number(e.target.value))}
                  min="0.1"
                  max="100"
                  step="0.1"
                  required
                />
                <span className="ml-2 text-gray-700">%</span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                This percentage of each transaction will be automatically saved.
                <br />
                <span className="font-medium">Example: </span>
                {savingsPercentage}% of a 100 ETH transaction = {savingsPercentage} ETH saved
              </p>
            </div>

            {/* Transaction Filters */}
            <div className="border-t pt-4">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="useFilters"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={useFilters}
                  onChange={(e) => setUseFilters(e.target.checked)}
                />
                <label htmlFor="useFilters" className="ml-2 block text-gray-700 font-medium">
                  Apply savings only to specific transactions
                </label>
              </div>

              {useFilters && (
                <div className="ml-6 space-y-4">
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-blue-600"
                        checked={filterType === 'categories'}
                        onChange={() => setFilterType('categories')}
                      />
                      <span className="ml-2 text-gray-700">Filter by categories</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-blue-600"
                        checked={filterType === 'addresses'}
                        onChange={() => setFilterType('addresses')}
                      />
                      <span className="ml-2 text-gray-700">Filter by merchant addresses</span>
                    </label>
                  </div>

                  {filterType === 'categories' && (
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Select Transaction Categories
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {TRANSACTION_CATEGORIES.map(category => (
                          <label key={category.id} className="inline-flex items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-blue-600"
                              checked={selectedCategories.includes(category.id)}
                              onChange={() => handleCategoryToggle(category.id)}
                            />
                            <span className="ml-2 text-gray-700">{category.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {filterType === 'addresses' && (
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Merchant Addresses
                      </label>
                      <div className="space-y-2">
                        {merchantAddresses.map((address, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="text"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={address}
                              onChange={(e) => handleMerchantAddressChange(index, e.target.value)}
                              placeholder="0x..."
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveMerchantAddress(index)}
                              className="text-red-500 hover:text-red-700"
                              disabled={merchantAddresses.length === 1}
                            >
                              <MinusCircle size={20} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={handleAddMerchantAddress}
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <PlusCircle size={20} className="mr-1" />
                          Add Another Address
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-6 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
              <p>Savings policy created successfully!</p>
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
                'Create Savings Policy'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
