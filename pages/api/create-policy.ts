import { NextApiRequest, NextApiResponse } from 'next';
import { CdpClient } from "@coinbase/cdp-sdk";
import { getApiKeys } from '../../lib/api-config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { scope, accountAddress } = req.body;

  // Validate required parameters
  if (!scope || (scope !== 'project' && scope !== 'account')) {
    return res.status(400).json({ error: 'Valid scope (project or account) is required' });
  }

  // Account address is required for account-level policies
  if (scope === 'account' && !accountAddress) {
    return res.status(400).json({ error: 'Account address is required for account-level policies' });
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
      // Create policy based on scope
      let policyConfig;
      
      if (scope === 'project') {
        console.log('Creating project-level policy');
        policyConfig = {
          policy: {
            scope: 'project',
            description: 'Project-wide Allowlist Policy',
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
          }
        };
      } else {
        console.log('Creating account-level policy for account:', accountAddress);
        policyConfig = {
          policy: {
            scope: 'account',
            description: 'Account Allowlist Policy',
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
          }
        };
        
        // For account-level policies, we need to specify the account
        if (accountAddress) {
          policyConfig.account = { address: accountAddress };
        }
      }
      
      // Create the policy
      const policy = await cdp.policies.createPolicy(policyConfig);
      
      console.log('Policy created successfully:', policy);
      
      return res.status(200).json({
        success: true,
        policyId: policy.id,
        scope: scope,
        ...(accountAddress && { accountAddress }),
        message: `Successfully created ${scope}-level policy`
      });
      
    } catch (error) {
      console.error('Policy Creation Error:', error);
      return res.status(500).json({ 
        error: `Failed to create ${scope}-level policy`,
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
