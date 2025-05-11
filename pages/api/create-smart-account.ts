
import { NextApiRequest, NextApiResponse } from 'next';
import { CdpClient } from "@coinbase/cdp-sdk";
import { getApiKeys } from '../../lib/api-config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ownerAddress, network } = req.body;

  if (!ownerAddress) {
    return res.status(400).json({ error: 'Owner address is required' });
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

    console.log('Fetching owner account for address:', ownerAddress);
    // First validate the owner account exists
    const ownerAccount = await cdp.evm.getAccount({ address: ownerAddress });
    console.log('Owner account response:', ownerAccount);
    
    if (!ownerAccount) {
      console.log('Owner account not found');
      return res.status(404).json({ error: 'Owner account not found' });
    }

    console.log('Creating smart account for owner:', ownerAddress);
    try {
      // Create smart account with specific network config
      const smartAccount = await cdp.evm.createSmartAccount({
        owner: ownerAccount
      });
      
      console.log('Smart account response:', smartAccount);

      if (!smartAccount) {
        throw new Error('Failed to create smart account - no response from CDP');
      }

      res.status(200).json({ 
        smartAccountAddress: smartAccount.address,
        network: network || 'base-sepolia'
      });
    } catch (error) {
      console.error('Smart Account Creation Error:', error);
      res.status(500).json({ 
        error: 'Failed to create smart account. Please try again.',
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
