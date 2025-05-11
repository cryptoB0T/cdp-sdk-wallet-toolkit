import { NextApiRequest, NextApiResponse } from 'next';
import { CdpClient } from "@coinbase/cdp-sdk";
import { getApiKeys } from '../../lib/api-config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Optional query parameters for pagination
  const { pageSize, pageToken } = req.query;

  try {
    // Get API keys from local storage or environment variables
    const { apiKeyId, apiKeySecret, walletSecret } = getApiKeys();
    
    if (!apiKeyId || !apiKeySecret || !walletSecret) {
      return res.status(500).json({ 
        error: 'Missing CDP configuration. Please check API keys in settings or environment variables.' 
      });
    }

    // Initialize CDP client
    const cdp = new CdpClient({
      apiKeyId,
      apiKeySecret,
      walletSecret,
    });

    // Call the listSmartAccounts API
    const response = await cdp.evm.listSmartAccounts({
      pageSize: pageSize ? Number(pageSize) : undefined,
      pageToken: pageToken as string | undefined,
    });

    // Return the response
    res.status(200).json({
      accounts: response.accounts,
      nextPageToken: response.nextPageToken
    });
  } catch (error: any) {
    console.error('List smart accounts error:', error);
    res.status(500).json({ 
      error: 'Failed to list smart accounts',
      details: error.message || 'Unknown error occurred'
    });
  }
}
