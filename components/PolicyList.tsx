import React, { useState, useEffect } from 'react';
import { Trash, Edit, Eye, RefreshCw } from 'lucide-react';

interface Policy {
  id: string;
  description: string;
  scope: 'project' | 'account';
  rules: any[];
  createdAt?: string;
  updatedAt?: string;
}

interface PolicyListProps {
  onViewPolicy: (policy: Policy) => void;
  onEditPolicy: (policy: Policy) => void;
  onDeletePolicy: (policyId: string) => void;
  onRefresh: () => void;
}

export default function PolicyList({ onViewPolicy, onEditPolicy, onDeletePolicy, onRefresh }: PolicyListProps) {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scope, setScope] = useState<'all' | 'project' | 'account'>('all');

  const fetchPolicies = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = scope !== 'all' ? `?scope=${scope}` : '';
      const response = await fetch(`/api/list-policies${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch policies');
      }

      // Ensure policies is always an array
      if (data.policies && Array.isArray(data.policies)) {
        setPolicies(data.policies);
      } else {
        console.warn('Policies data is not an array:', data.policies);
        setPolicies([]);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching policies');
      console.error('Policy fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, [scope]);

  // Format date string
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  // Truncate policy ID for display
  const truncateId = (id: string) => {
    if (id.length <= 8) return id;
    return `${id.substring(0, 8)}...`;
  };

  // Get a summary of the policy rules
  const getRuleSummary = (rules: any[]) => {
    if (!rules || rules.length === 0) return 'No rules defined';
    
    const rule = rules[0];
    let summary = `${rule.action} ${rule.operation}`;
    
    if (rules.length > 1) {
      summary += ` (+${rules.length - 1} more)`;
    }
    
    return summary;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Policies</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Filter:</label>
            <select
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={scope}
              onChange={(e) => setScope(e.target.value as any)}
            >
              <option value="all">All Policies</option>
              <option value="project">Project Policies</option>
              <option value="account">Account Policies</option>
            </select>
          </div>
          <button
            onClick={() => {
              fetchPolicies();
              onRefresh();
            }}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            disabled={loading}
          >
            <RefreshCw size={16} className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p>{error}</p>
        </div>
      )}

      {loading && !error ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading policies...</p>
        </div>
      ) : policies.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <p className="text-gray-600">No policies found</p>
          <p className="text-sm text-gray-500 mt-1">Create a new policy to get started</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scope</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rules</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(policies) && policies.length > 0 ? policies.map((policy) => (
                <tr key={policy.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{truncateId(policy.id)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{policy.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      policy.scope === 'project' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {policy.scope}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getRuleSummary(policy.rules)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(policy.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onViewPolicy(policy)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Policy"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onEditPolicy(policy)}
                        className="text-amber-600 hover:text-amber-900"
                        title="Edit Policy"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDeletePolicy(policy.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Policy"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No policies found. Create your first policy to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
