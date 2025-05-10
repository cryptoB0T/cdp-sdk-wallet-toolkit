import { NextApiRequest, NextApiResponse } from 'next';
import { CdpClient } from "@coinbase/cdp-sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Optional query parameters for pagination
  const { pageSize, pageToken } = req.query;

  try {
    // Initialize CDP client
    const cdp = new CdpClient({
      apiKeyId: process.env.CDP_API_KEY_ID,
      apiKeySecret: process.env.CDP_API_KEY_SECRET,
      walletSecret: process.env.CDP_WALLET_SECRET,
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
