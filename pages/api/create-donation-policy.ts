import { NextApiRequest, NextApiResponse } from 'next';
import { CdpClient } from "@coinbase/cdp-sdk";
import { getApiKeys } from '../../lib/api-config';
import { parseEther } from 'viem';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { accountAddress, donationPercentage, donationAddress, description } = req.body;

  // Validate required parameters
  if (!accountAddress) {
    return res.status(400).json({ error: 'Account address is required' });
  }

  if (!donationAddress || !donationAddress.startsWith('0x')) {
    return res.status(400).json({ error: 'Valid donation address is required' });
  }

  if (donationPercentage === undefined || donationPercentage <= 0 || donationPercentage > 100) {
    return res.status(400).json({ error: 'Donation percentage must be between 0 and 100' });
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
      console.log(`Creating donation policy for account: ${accountAddress}`);
      console.log(`Donation percentage: ${donationPercentage}%`);
      console.log(`Donation address: ${donationAddress}`);
      
      // Create a policy config for automatic donations
      // Since the CDP SDK doesn't directly support donation policies, we'll create a standard policy
      // and use custom metadata to indicate it's a donation policy
      
      // First, create a standard policy structure that matches the SDK's expected types
      const policyConfig: any = {
        policy: {
          scope: 'account' as 'account',
          description: description || `Automatic ${donationPercentage}% Donation Policy`,
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
                  addresses: [donationAddress] // Use the donation address as the allowed address
                }
              ]
            }
          ]
        },
        account: { 
          address: accountAddress 
        }
      };
      
      // Add custom metadata to the policy for our application to recognize it as a donation policy
      // We'll store this in a way that doesn't interfere with the SDK's validation
      policyConfig.metadata = {
        isDonationPolicy: true,
        donationPercentage: donationPercentage,
        donationAddress: donationAddress
      };
      
      // Create the policy
      const policy = await cdp.policies.createPolicy(policyConfig);
      
      console.log('Donation policy created successfully:', policy);
      
      return res.status(200).json({
        success: true,
        policyId: policy.id,
        accountAddress,
        donationPercentage,
        donationAddress,
        message: `Successfully created donation policy for ${accountAddress}`
      });
      
    } catch (error) {
      console.error('Donation Policy Creation Error:', error);
      return res.status(500).json({ 
        error: `Failed to create donation policy`,
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
