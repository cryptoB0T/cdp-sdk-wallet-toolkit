import { NextApiRequest, NextApiResponse } from 'next';
import { CdpClient } from "@coinbase/cdp-sdk";
import { getApiKeys } from '../../lib/api-config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 
    sourceAccountAddress, 
    savingsAccountAddress, 
    savingsPercentage, 
    description,
    filters 
  } = req.body;

  // Validate required parameters
  if (!sourceAccountAddress) {
    return res.status(400).json({ error: 'Source account address is required' });
  }

  if (!savingsAccountAddress) {
    return res.status(400).json({ error: 'Savings account address is required' });
  }

  if (sourceAccountAddress === savingsAccountAddress) {
    return res.status(400).json({ error: 'Source and savings accounts must be different' });
  }

  if (savingsPercentage === undefined || savingsPercentage <= 0 || savingsPercentage > 100) {
    return res.status(400).json({ error: 'Savings percentage must be between 0 and 100' });
  }

  // Validate filters if provided
  if (filters) {
    if (filters.type === 'addresses' && (!filters.addresses || filters.addresses.length === 0)) {
      return res.status(400).json({ error: 'At least one merchant address is required when using address filters' });
    }

    if (filters.type === 'categories' && (!filters.categories || filters.categories.length === 0)) {
      return res.status(400).json({ error: 'At least one category is required when using category filters' });
    }
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

    try {
      console.log(`Creating savings policy for account: ${sourceAccountAddress}`);
      console.log(`Savings percentage: ${savingsPercentage}%`);
      console.log(`Savings account: ${savingsAccountAddress}`);
      
      if (filters) {
        console.log(`Using filters: ${JSON.stringify(filters)}`);
      }
      
      // Create a policy config for automated savings
      // Since the CDP SDK doesn't directly support savings policies, we'll create a standard policy
      // and use custom metadata to indicate it's a savings policy
      
      // First, create a standard policy structure that matches the SDK's expected types
      const policyConfig: any = {
        policy: {
          scope: 'account' as 'account',
          description: description || `Automated ${savingsPercentage}% Savings Policy`,
          rules: [
            {
              action: 'accept' as 'accept',
              operation: 'signEvmTransaction' as 'signEvmTransaction',
              criteria: [
                // Add a simple criteria that will always pass
                // This ensures the policy is valid according to the SDK
                {
                  type: 'evmAddress' as 'evmAddress',
                  operator: 'in' as 'in',
                  addresses: [savingsAccountAddress] // Use the savings address as the allowed address
                }
              ]
            }
          ]
        },
        account: { 
          address: sourceAccountAddress 
        }
      };
      
      // Add custom metadata to the policy for our application to recognize it as a savings policy
      policyConfig.metadata = {
        isSavingsPolicy: true,
        savingsPercentage: savingsPercentage,
        savingsAccountAddress: savingsAccountAddress,
        filters: filters || null
      };
      
      // Create the policy
      const policy = await cdp.policies.createPolicy(policyConfig);
      
      console.log('Savings policy created successfully:', policy);
      
      return res.status(200).json({
        success: true,
        policyId: policy.id,
        sourceAccountAddress,
        savingsAccountAddress,
        savingsPercentage,
        filters: filters || null,
        message: `Successfully created savings policy for ${sourceAccountAddress}`
      });
      
    } catch (error) {
      console.error('Savings Policy Creation Error:', error);
      return res.status(500).json({ 
        error: `Failed to create savings policy`,
        details: error.message 
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
