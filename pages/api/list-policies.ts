import { NextApiRequest, NextApiResponse } from 'next';
import { CdpClient } from "@coinbase/cdp-sdk";
import { getApiKeys } from '../../lib/api-config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract query parameters
  const { scope } = req.query;

  // Validate scope if provided
  if (scope && scope !== 'project' && scope !== 'account') {
    return res.status(400).json({ error: 'Invalid scope. Must be either "project" or "account"' });
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
      console.log(`Listing policies with scope: ${scope || 'all'}`);
      
      try {
        // Call the CDP SDK to list policies
        const policies = await cdp.policies.listPolicies({
          scope: scope as 'project' | 'account' | undefined
        });
        
        // Ensure policies is always an array
        const policiesArray = Array.isArray(policies) ? policies : [];
        
        console.log(`Found ${policiesArray.length} policies`);
        
        return res.status(200).json({
          success: true,
          policies: policiesArray,
          count: policiesArray.length
        });
      } catch (error) {
        console.error('Error in listPolicies:', error);
        
        // If there's an error but it's not critical, return an empty array
        return res.status(200).json({
          success: true,
          policies: [],
          count: 0,
          warning: 'Could not retrieve policies, returning empty list'
        });
      }
      
    } catch (error) {
      console.error('Policy Listing Error:', error);
      return res.status(500).json({ 
        error: 'Failed to list policies',
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
