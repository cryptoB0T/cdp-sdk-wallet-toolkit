import { NextApiRequest, NextApiResponse } from 'next';
import { CdpClient } from "@coinbase/cdp-sdk";
import { getApiKeys } from '../../lib/api-config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get API keys from local storage or environment variables
    const { apiKeyId, apiKeySecret, walletSecret } = getApiKeys();
    
    if (!apiKeyId || !apiKeySecret || !walletSecret) {
      return res.status(500).json({ 
        error: 'Missing CDP configuration. Please check API keys in settings or environment variables.' 
      });
    }

    const cdp = new CdpClient({
      apiKeyId,
      apiKeySecret,
      walletSecret,
    });

    // Custom replacer for BigInt serialization
    const safeJsonReplacer = (key: string, value: any) => {
      if (typeof value === 'bigint') {
        return value.toString();
      }
      return value;
    };

    // Fetch both EVM and Solana accounts
    let allAccounts = [];
    
    try {
      console.log('Fetching EVM accounts');
      const evmResponse = await cdp.evm.listAccounts();
      if (evmResponse && evmResponse.accounts) {
        const evmAccounts = evmResponse.accounts.map(account => ({
          ...account,
          type: 'EVM'
        }));
        allAccounts = [...allAccounts, ...evmAccounts];
      }
    } catch (error) {
      console.error('Error fetching EVM accounts:', error);
      // Continue even if EVM accounts fail
    }
    
    try {
      console.log('Fetching Solana accounts');
      const solanaResponse = await cdp.solana.listAccounts();
      if (solanaResponse && solanaResponse.accounts) {
        const solanaAccounts = solanaResponse.accounts.map(account => ({
          ...account,
          type: 'SOLANA'
        }));
        allAccounts = [...allAccounts, ...solanaAccounts];
      }
    } catch (error) {
      console.error('Error fetching Solana accounts:', error);
      // Continue even if Solana accounts fail
    }

    // Serialize and then parse to ensure all BigInt values are converted to strings
    const safeAccounts = JSON.parse(JSON.stringify(allAccounts, safeJsonReplacer));
    
    res.status(200).json({ 
      success: true,
      accounts: safeAccounts,
      count: safeAccounts.length
    });
  } catch (error: any) {
    console.error('List all accounts error:', error);
    res.status(500).json({ 
      error: 'Failed to list accounts',
      details: error.message || 'Unknown error occurred'
    });
  }
}
