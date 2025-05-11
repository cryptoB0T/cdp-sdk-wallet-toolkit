import React, { useState, useEffect } from 'react';
import { X, Plus, Trash, Loader2 } from 'lucide-react';

interface Policy {
  id: string;
  description: string;
  scope: 'project' | 'account';
  rules: any[];
  createdAt?: string;
  updatedAt?: string;
}

interface Account {
  address: string;
  type: 'EVM' | 'SOLANA';
  createdAt?: string;
  updatedAt?: string;
  name?: string;
}

interface PolicyDetailProps {
  policy?: Policy;
  mode: 'view' | 'edit' | 'create';
  onClose: () => void;
  onSave: (policy: any) => void;
}

export default function PolicyDetail({ policy, mode, onClose, onSave }: PolicyDetailProps) {
  const [formData, setFormData] = useState<any>({
    description: '',
    scope: 'project',
    rules: [
      {
        action: 'accept',
        operation: 'signEvmTransaction',
        criteria: [
          {
            type: 'ethValue',
            ethValue: '1000000000000000000', // 1 ETH in wei
            operator: '<='
          },
          {
            type: 'evmAddress',
            addresses: ["0x000000000000000000000000000000000000dEaD"],
            operator: 'in'
          }
        ]
      }
    ]
  });
  const [accountAddress, setAccountAddress] = useState('');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Initialize form data when policy changes
  useEffect(() => {
    if (policy && (mode === 'view' || mode === 'edit')) {
      setFormData({
        description: policy.description || '',
        scope: policy.scope || 'project',
        rules: policy.rules || []
      });
    }
  }, [policy, mode]);

  // Fetch accounts when the component mounts or when scope changes to 'account'
  useEffect(() => {
    if (formData.scope === 'account' && mode !== 'view') {
      fetchAccounts();
    }
  }, [formData.scope, mode]);

  // Function to fetch accounts from the API
  const fetchAccounts = async () => {
    setLoadingAccounts(true);
    try {
      const response = await fetch('/api/list-all-accounts');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch accounts');
      }

      if (data.accounts && Array.isArray(data.accounts)) {
        setAccounts(data.accounts);
      } else {
        console.warn('Accounts data is not an array:', data.accounts);
        setAccounts([]);
      }
    } catch (err) {
      console.error('Account fetch error:', err);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleScopeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const scope = e.target.value as 'project' | 'account';
    setFormData({
      ...formData,
      scope
    });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length > 100) {
      errors.description = 'Description must be less than 100 characters';
    }
    
    if (formData.scope === 'account' && !accountAddress) {
      errors.accountAddress = 'Account address is required for account-level policies';
    }
    
    if (!formData.rules || formData.rules.length === 0) {
      errors.rules = 'At least one rule is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    // Prepare the policy data for saving
    const policyData: any = {
      ...formData
    };
    
    // For account-level policies, include the account address
    if (formData.scope === 'account') {
      policyData.accountAddress = accountAddress;
    }
    
    // If editing, include the policy ID
    if (mode === 'edit' && policy) {
      policyData.id = policy.id;
    }
    
    onSave(policyData);
  };

  // Add a new rule to the policy
  const addRule = () => {
    setFormData({
      ...formData,
      rules: [
        ...formData.rules,
        {
          action: 'accept',
          operation: 'signEvmTransaction',
          criteria: []
        }
      ]
    });
  };

  // Remove a rule from the policy
  const removeRule = (index: number) => {
    const updatedRules = [...formData.rules];
    updatedRules.splice(index, 1);
    setFormData({
      ...formData,
      rules: updatedRules
    });
  };

  // Update a rule property
  const updateRuleProperty = (ruleIndex: number, property: string, value: string) => {
    const updatedRules = [...formData.rules];
    updatedRules[ruleIndex] = {
      ...updatedRules[ruleIndex],
      [property]: value
    };
    setFormData({
      ...formData,
      rules: updatedRules
    });
  };

  // Add a criterion to a rule
  const addCriterion = (ruleIndex: number) => {
    const updatedRules = [...formData.rules];
    if (!updatedRules[ruleIndex].criteria) {
      updatedRules[ruleIndex].criteria = [];
    }
    
    updatedRules[ruleIndex].criteria.push({
      type: 'ethValue',
      ethValue: '1000000000000000000', // 1 ETH in wei
      operator: '<='
    });
    
    setFormData({
      ...formData,
      rules: updatedRules
    });
  };

  // Remove a criterion from a rule
  const removeCriterion = (ruleIndex: number, criterionIndex: number) => {
    const updatedRules = [...formData.rules];
    updatedRules[ruleIndex].criteria.splice(criterionIndex, 1);
    setFormData({
      ...formData,
      rules: updatedRules
    });
  };

  // Update a criterion property
  const updateCriterionProperty = (ruleIndex: number, criterionIndex: number, property: string, value: any) => {
    const updatedRules = [...formData.rules];
    updatedRules[ruleIndex].criteria[criterionIndex] = {
      ...updatedRules[ruleIndex].criteria[criterionIndex],
      [property]: value
    };
    setFormData({
      ...formData,
      rules: updatedRules
    });
  };

  // Update addresses in a criterion
  const updateAddresses = (ruleIndex: number, criterionIndex: number, addressesStr: string) => {
    try {
      // Split by commas and trim whitespace
      const addresses = addressesStr.split(',').map(addr => addr.trim());
      
      const updatedRules = [...formData.rules];
      updatedRules[ruleIndex].criteria[criterionIndex].addresses = addresses;
      
      setFormData({
        ...formData,
        rules: updatedRules
      });
    } catch (error) {
      console.error('Error updating addresses:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === 'view' ? 'View Policy' : mode === 'edit' ? 'Edit Policy' : 'Create Policy'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Policy Description */}
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  validationErrors.description 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Policy description"
                disabled={mode === 'view'}
                required
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
              )}
            </div>

            {/* Policy Scope */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Policy Scope</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-5 w-5 text-blue-600"
                    value="project"
                    checked={formData.scope === 'project'}
                    onChange={handleScopeChange}
                    disabled={mode === 'view'}
                  />
                  <span className="ml-2 text-gray-700">Project-level</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-5 w-5 text-blue-600"
                    value="account"
                    checked={formData.scope === 'account'}
                    onChange={handleScopeChange}
                    disabled={mode === 'view'}
                  />
                  <span className="ml-2 text-gray-700">Account-level</span>
                </label>
              </div>
            </div>

            {/* Account Address (for account-level policies) */}
            {formData.scope === 'account' && (
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="accountAddress">
                  Account Address
                </label>
                <div className="relative">
                  {loadingAccounts && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                    </div>
                  )}
                  <select
                    id="accountAddress"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 appearance-none ${
                      validationErrors.accountAddress 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    value={accountAddress}
                    onChange={(e) => setAccountAddress(e.target.value)}
                    disabled={mode === 'view' || loadingAccounts}
                    required
                  >
                    <option value="">Select an account</option>
                    {accounts.map((account) => (
                      <option key={account.address} value={account.address}>
                        {account.name || account.address} ({account.type})
                      </option>
                    ))}
                  </select>
                </div>
                {accounts.length === 0 && !loadingAccounts && (
                  <p className="mt-1 text-sm text-amber-600">
                    No accounts found. Please create an account first.
                  </p>
                )}
                {validationErrors.accountAddress && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.accountAddress}</p>
                )}
              </div>
            )}

            {/* Rules Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 font-medium">Rules</label>
                {mode !== 'view' && (
                  <button
                    type="button"
                    onClick={addRule}
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Rule
                  </button>
                )}
              </div>

              {validationErrors.rules && (
                <p className="mb-2 text-sm text-red-600">{validationErrors.rules}</p>
              )}

              <div className="space-y-4">
                {formData.rules.map((rule: any, ruleIndex: number) => (
                  <div key={ruleIndex} className="border border-gray-200 rounded-md p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-800">Rule {ruleIndex + 1}</h3>
                      {mode !== 'view' && (
                        <button
                          type="button"
                          onClick={() => removeRule(ruleIndex)}
                          className="text-red-600 hover:text-red-800"
                          disabled={formData.rules.length <= 1}
                        >
                          <Trash size={16} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Action */}
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Action
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={rule.action}
                          onChange={(e) => updateRuleProperty(ruleIndex, 'action', e.target.value)}
                          disabled={mode === 'view'}
                        >
                          <option value="accept">Accept</option>
                          <option value="reject">Reject</option>
                        </select>
                      </div>

                      {/* Operation */}
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Operation
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={rule.operation}
                          onChange={(e) => updateRuleProperty(ruleIndex, 'operation', e.target.value)}
                          disabled={mode === 'view'}
                        >
                          <option value="signEvmTransaction">Sign EVM Transaction</option>
                          <option value="signSolTransaction">Sign Solana Transaction</option>
                        </select>
                      </div>
                    </div>

                    {/* Criteria */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-gray-700 text-sm font-medium">Criteria</label>
                        {mode !== 'view' && (
                          <button
                            type="button"
                            onClick={() => addCriterion(ruleIndex)}
                            className="text-blue-600 hover:text-blue-800 flex items-center text-xs"
                          >
                            <Plus size={14} className="mr-1" />
                            Add Criterion
                          </button>
                        )}
                      </div>

                      <div className="space-y-3">
                        {rule.criteria && rule.criteria.map((criterion: any, criterionIndex: number) => (
                          <div key={criterionIndex} className="border border-gray-200 rounded-md p-3 bg-white">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-sm font-medium text-gray-700">Criterion {criterionIndex + 1}</h4>
                              {mode !== 'view' && (
                                <button
                                  type="button"
                                  onClick={() => removeCriterion(ruleIndex, criterionIndex)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash size={14} />
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {/* Criterion Type */}
                              <div>
                                <label className="block text-gray-700 text-xs font-medium mb-1">
                                  Type
                                </label>
                                <select
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={criterion.type}
                                  onChange={(e) => updateCriterionProperty(ruleIndex, criterionIndex, 'type', e.target.value)}
                                  disabled={mode === 'view'}
                                >
                                  <option value="ethValue">ETH Value</option>
                                  <option value="evmAddress">EVM Address</option>
                                  <option value="solAddress">Solana Address</option>
                                </select>
                              </div>

                              {/* Operator */}
                              <div>
                                <label className="block text-gray-700 text-xs font-medium mb-1">
                                  Operator
                                </label>
                                <select
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={criterion.operator}
                                  onChange={(e) => updateCriterionProperty(ruleIndex, criterionIndex, 'operator', e.target.value)}
                                  disabled={mode === 'view'}
                                >
                                  {criterion.type === 'ethValue' ? (
                                    <>
                                      <option value="<=">&lt;= (Maximum)</option>
                                      <option value=">=">&gt;= (Minimum)</option>
                                      <option value="<">&lt; (Less than)</option>
                                      <option value=">">&gt; (Greater than)</option>
                                      <option value="==">== (Exact match)</option>
                                      <option value="between">Between (Min and Max)</option>
                                    </>
                                  ) : (
                                    <>
                                      <option value="in">in</option>
                                      <option value="not in">not in</option>
                                    </>
                                  )}
                                </select>
                              </div>

                              {/* Value */}
                              {criterion.type === 'ethValue' ? (
                                criterion.operator === 'between' ? (
                                  <div className="space-y-2">
                                    <div>
                                      <label className="block text-gray-700 text-xs font-medium mb-1">
                                        Minimum ETH Value (Wei)
                                      </label>
                                      <input
                                        type="text"
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={criterion.minEthValue || ''}
                                        onChange={(e) => updateCriterionProperty(ruleIndex, criterionIndex, 'minEthValue', e.target.value)}
                                        placeholder="1000000000000000000"
                                        disabled={mode === 'view'}
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-gray-700 text-xs font-medium mb-1">
                                        Maximum ETH Value (Wei)
                                      </label>
                                      <input
                                        type="text"
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={criterion.maxEthValue || ''}
                                        onChange={(e) => updateCriterionProperty(ruleIndex, criterionIndex, 'maxEthValue', e.target.value)}
                                        placeholder="10000000000000000000"
                                        disabled={mode === 'view'}
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    <label className="block text-gray-700 text-xs font-medium mb-1">
                                      ETH Value (Wei)
                                    </label>
                                    <input
                                      type="text"
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      value={criterion.ethValue}
                                      onChange={(e) => updateCriterionProperty(ruleIndex, criterionIndex, 'ethValue', e.target.value)}
                                      placeholder="1000000000000000000"
                                      disabled={mode === 'view'}
                                    />
                                  </div>
                                )
                              ) : (
                                <div>
                                  <label className="block text-gray-700 text-xs font-medium mb-1">
                                    Addresses (comma separated)
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={criterion.addresses ? criterion.addresses.join(', ') : ''}
                                    onChange={(e) => updateAddresses(ruleIndex, criterionIndex, e.target.value)}
                                    placeholder="0x..., 0x..."
                                    disabled={mode === 'view'}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {mode !== 'view' && (
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                disabled={loading}
              >
                {loading ? 'Saving...' : mode === 'edit' ? 'Update Policy' : 'Create Policy'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
