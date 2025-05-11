import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Plus, DollarSign, Wallet, PiggyBank } from 'lucide-react';
import PolicyList from '../components/PolicyList';
import PolicyDetail from '../components/PolicyDetail';
import PolicyTester from '../components/PolicyTester';
import DonationPolicyCreator from '../components/DonationPolicyCreator';
import SavingsPolicyCreator from '../components/SavingsPolicyCreator';

interface Policy {
  id: string;
  description: string;
  scope: 'project' | 'account';
  rules: any[];
  createdAt?: string;
  updatedAt?: string;
}

export default function PolicyManagementPage() {
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | undefined>(undefined);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create' | null>(null);
  const [showDonationCreator, setShowDonationCreator] = useState(false);
  const [showSavingsCreator, setShowSavingsCreator] = useState(false);
  const [showTester, setShowTester] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Clear notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleCreatePolicy = () => {
    setSelectedPolicy(undefined);
    setModalMode('create');
    setShowDonationCreator(false);
    setShowSavingsCreator(false);
  };

  const handleCreateDonationPolicy = () => {
    setModalMode(null);
    setShowDonationCreator(true);
    setShowSavingsCreator(false);
  };

  const handleCreateSavingsPolicy = () => {
    setModalMode(null);
    setShowDonationCreator(false);
    setShowSavingsCreator(true);
  };

  const handleViewPolicy = (policy: Policy) => {
    setSelectedPolicy(policy);
    setModalMode('view');
  };

  const handleEditPolicy = (policy: Policy) => {
    setSelectedPolicy(policy);
    setModalMode('edit');
  };

  const handleDeletePolicy = async (policyId: string) => {
    if (!window.confirm('Are you sure you want to delete this policy? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/delete-policy?id=${policyId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete policy');
      }
      
      setNotification({
        type: 'success',
        message: 'Policy deleted successfully'
      });
      
      // Trigger refresh of policy list
      setRefreshTrigger(prev => prev + 1);
      
    } catch (error) {
      console.error('Policy deletion error:', error);
      setNotification({
        type: 'error',
        message: error.message || 'An error occurred while deleting the policy'
      });
    }
  };

  const handleSavePolicy = async (policyData: any) => {
    try {
      let response;
      let successMessage;
      
      if (modalMode === 'create') {
        // Creating a new policy
        response = await fetch('/api/create-policy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            scope: policyData.scope,
            accountAddress: policyData.accountAddress,
            policy: {
              description: policyData.description,
              rules: policyData.rules
            }
          }),
        });
        
        successMessage = 'Policy created successfully';
      } else if (modalMode === 'edit' && selectedPolicy) {
        // Updating an existing policy
        response = await fetch('/api/update-policy', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: selectedPolicy.id,
            policy: {
              description: policyData.description,
              rules: policyData.rules
            }
          }),
        });
        
        successMessage = 'Policy updated successfully';
      } else {
        throw new Error('Invalid operation');
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Operation failed');
      }
      
      setNotification({
        type: 'success',
        message: successMessage
      });
      
      // Close the modal
      setModalMode(null);
      
      // If this was a new policy and we got a policy ID back, show the tester
      if (modalMode === 'create' && data.policyId) {
        setSelectedPolicy({
          id: data.policyId,
          description: policyData.description,
          scope: policyData.scope,
          rules: policyData.rules
        });
        setShowTester(true);
      }
      
      // Trigger refresh of policy list
      setRefreshTrigger(prev => prev + 1);
      
    } catch (error) {
      console.error('Policy save error:', error);
      setNotification({
        type: 'error',
        message: error.message || 'An error occurred while saving the policy'
      });
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const closeModal = () => {
    setModalMode(null);
  };

  const closeDonationCreator = () => {
    setShowDonationCreator(false);
  };

  const closeSavingsCreator = () => {
    setShowSavingsCreator(false);
  };

  const handleDonationPolicySuccess = (policyId: string) => {
    setNotification({
      type: 'success',
      message: 'Donation policy created successfully!'
    });
    setRefreshTrigger(prev => prev + 1);
    setTimeout(() => {
      setShowDonationCreator(false);
    }, 1500);
  };

  const handleSavingsPolicySuccess = (policyId: string) => {
    setNotification({
      type: 'success',
      message: 'Savings policy created successfully!'
    });
    setRefreshTrigger(prev => prev + 1);
    setTimeout(() => {
      setShowSavingsCreator(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Policy Management</title>
        <meta name="description" content="Create and manage wallet policies" />
      </Head>

      <div className="flex justify-between items-center mb-8">
        <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
          &larr; Back to Home
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-center mb-8">Contract Policy Management</h1>
      
      {notification && (
        <div className={`mb-6 p-4 rounded-md ${
          notification.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          <p>{notification.message}</p>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto">
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-3">About Policies</h2>
          <p className="mb-3">
            Policies allow you to set rules that govern the behavior of accounts and projects, 
            such as enforcing allowlists and denylists for transactions.
          </p>
          <p className="mb-3">
            You can create both project-level policies (applying to all accounts) and 
            account-level policies (specific to individual accounts).
          </p>
          <div className="bg-white p-4 rounded border border-blue-200 mt-4">
            <h3 className="text-lg font-medium mb-2 text-blue-800">Policy Types</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Project-level policies:</strong> Apply to all accounts in the project</li>
              <li><strong>Account-level policies:</strong> Apply only to specific accounts</li>
              <li><strong>Min/Max policies:</strong> Set minimum and maximum transaction values</li>
              <li><strong>Donation policies:</strong> Automatically donate a percentage of each transaction</li>
              <li><strong>Savings policies:</strong> Automatically save a percentage of each transaction</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap justify-end mb-4 gap-3">
          <button
            onClick={handleCreateSavingsPolicy}
            className="flex items-center bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors"
          >
            <PiggyBank size={18} className="mr-1" />
            Create Savings Policy
          </button>
          <button
            onClick={handleCreateDonationPolicy}
            className="flex items-center bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors"
          >
            <DollarSign size={18} className="mr-1" />
            Create Donation Policy
          </button>
          <button
            onClick={handleCreatePolicy}
            className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
          >
            <Plus size={18} className="mr-1" />
            Create Standard Policy
          </button>
        </div>

        <PolicyList 
          onViewPolicy={handleViewPolicy}
          onEditPolicy={handleEditPolicy}
          onDeletePolicy={handleDeletePolicy}
          onRefresh={handleRefresh}
          key={refreshTrigger}
        />
        
        {showTester && selectedPolicy && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Test Your Policy</h2>
            <p className="text-center mb-6 text-gray-600">
              Now you can test your policy by sending transactions with different amounts.
            </p>
            <PolicyTester 
              policyId={selectedPolicy.id}
              scope={selectedPolicy.scope}
              accountAddress={undefined}
              maxEthValue="1"
              allowedAddress="0x000000000000000000000000000000000000dEaD"
            />
          </div>
        )}
      </div>

      {modalMode && (
        <PolicyDetail
          policy={selectedPolicy}
          mode={modalMode}
          onClose={closeModal}
          onSave={handleSavePolicy}
        />
      )}

      {showDonationCreator && (
        <DonationPolicyCreator
          onClose={closeDonationCreator}
          onSuccess={handleDonationPolicySuccess}
        />
      )}

      {showSavingsCreator && (
        <SavingsPolicyCreator
          onClose={closeSavingsCreator}
          onSuccess={handleSavingsPolicySuccess}
        />
      )}
    </div>
  );
}
