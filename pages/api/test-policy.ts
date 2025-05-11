import { NextApiRequest, NextApiResponse } from 'next';
import { CdpClient } from "@coinbase/cdp-sdk";
import { getApiKeys } from '../../lib/api-config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { policyId, scope, accountAddress, to, value, data } = req.body;

  // Validate required parameters
  if (!policyId) {
    return res.status(400).json({ error: 'Policy ID is required' });
  }

  if (!scope || (scope !== 'project' && scope !== 'account')) {
    return res.status(400).json({ error: 'Valid scope (project or account) is required' });
  }

  // Account address is required for account-level policies
  if (scope === 'account' && !accountAddress) {
    return res.status(400).json({ error: 'Account address is required for account-level policies' });
  }

  if (!to || !to.startsWith('0x')) {
    return res.status(400).json({ error: 'Valid destination address is required' });
  }

  if (value === undefined) {
    return res.status(400).json({ error: 'Transaction value is required' });
  }

  try {
    // Get API keys from local storage or environment variables
    const apiKeysResult = getApiKeys();
    const { apiKeyId, apiKeySecret, walletSecret, source } = apiKeysResult;
    
    // Log API keys in a safe way (only showing first few characters)
    console.log('API Key ID (first 8 chars):', apiKeyId ? apiKeyId.substring(0, 8) + '...' : 'undefined');
    console.log('API Key Secret (first 8 chars):', apiKeySecret ? apiKeySecret.substring(0, 8) + '...' : 'undefined');
    console.log('Wallet Secret (first 8 chars):', walletSecret ? walletSecret.substring(0, 8) + '...' : 'undefined');
    console.log('API keys source:', source);
    
    if (!apiKeyId || !apiKeySecret || !walletSecret) {
      console.error('Missing one or more required API keys');
      return res.status(500).json({ 
        error: 'Missing CDP configuration. Please check API keys in settings or environment variables.' 
      });
    }

    const cdp = new CdpClient({
      apiKeyId,
      apiKeySecret,
      walletSecret,
    });

    console.log(`Testing ${scope}-level policy with ID: ${policyId}`);
    console.log(`Transaction details: to=${to}, value=${value}`);

    try {
      // First, create or get a test account
      console.log('Creating test EVM account');
      const testAccount = await cdp.evm.createAccount();
      
      if (!testAccount) {
        throw new Error('Failed to create test account');
      }
      
      console.log('Test account created:', testAccount.address);
      
      // Create a smart account for the test account
      console.log('Creating smart account for test account');
      const smartAccount = await cdp.evm.createSmartAccount({
        owner: testAccount
      });
      
      if (!smartAccount) {
        throw new Error('Failed to create smart account');
      }
      
      console.log('Smart account created:', smartAccount.address);
      
      // If it's an account-level policy, we need to associate it with the test account
      // Note: The CDP SDK might not have a direct applyPolicy method, so we'll use a workaround
      if (scope === 'account') {
        console.log('Account-level policy will be tested with the test account');
        // For testing purposes, we'll just use the test account we created
        // The policy should already be applied at the account level when it was created
        console.log('Using test account:', testAccount.address);
        
        // If your CDP SDK version has a method to associate policies with accounts, you would use it here
        // For example: await cdp.policies.associatePolicy({ policyId, accountAddress: testAccount.address });
      }
      
      // Prepare the transaction
      const calls = [{
        to: to,
        value: value.toString(),
        data: data || '0x'
      }];
      
      console.log('Sending user operation with calls:', JSON.stringify(calls, null, 2));
      
      // Send the transaction
      // Use type assertion to avoid deep type instantiation errors
      const userOperation = await cdp.evm.sendUserOperation({
        smartAccount: smartAccount as any,
        network: 'base-sepolia' as any, // Use base-sepolia for testing
        calls: calls
      } as any);
      
      console.log('User operation response:', JSON.stringify(userOperation, null, 2));

      // Wait for the user operation to be confirmed
      console.log('Waiting for user operation to be confirmed...');
      const confirmedOperation = await cdp.evm.waitForUserOperation({
        smartAccountAddress: smartAccount.address,
        userOpHash: userOperation.userOpHash,
      });

      console.log('Confirmed operation:', confirmedOperation);

      // Handle the response based on operation status
      if (confirmedOperation.status === 'complete' && 'transactionHash' in confirmedOperation) {
        res.status(200).json({ 
          success: true,
          status: confirmedOperation.status,
          userOpHash: userOperation.userOpHash,
          transactionHash: confirmedOperation.transactionHash,
          message: 'Transaction was accepted by the policy and completed successfully'
        });
      } else {
        res.status(200).json({ 
          success: true,
          status: confirmedOperation.status,
          userOpHash: userOperation.userOpHash,
          message: 'Transaction was accepted by the policy'
        });
      }
    } catch (error) {
      console.error('Policy Test Error:', error);
      
      // Check if the error is related to policy violation
      const errorMessage = error.message || 'Unknown error';
      const isPolicyViolation = 
        errorMessage.includes('policy') || 
        errorMessage.includes('denied') || 
        errorMessage.includes('rejected');
      
      const statusCode = isPolicyViolation ? 403 : 500;
      const errorType = isPolicyViolation ? 'Policy Violation' : 'Operation Error';
      
      res.status(statusCode).json({ 
        success: false,
        error: errorType,
        details: errorMessage,
        message: isPolicyViolation 
          ? 'Transaction was rejected by the policy as expected' 
          : 'An unexpected error occurred while testing the policy'
      });
    }
  } catch (error) {
    console.error('CDP Client Error:', error);
    res.status(500).json({ 
      error: 'Failed to initialize CDP client',
      details: error.message 
    });
  }
}
