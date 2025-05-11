
import { NextApiRequest, NextApiResponse } from 'next';
import { CdpClient } from "@coinbase/cdp-sdk";
import { parseEther } from "viem";
import { getApiKeys } from '../../lib/api-config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fromAddress, toAddress, amount } = req.body;

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

    // Use CDP's native transaction sending capabilities
    const txResult = await cdp.evm.sendTransaction({
      address: fromAddress,
      network: req.body.network || "base-sepolia",
      transaction: {
        to: toAddress,
        value: parseEther(amount)
      }
    });
    
    const transactionHash = txResult.transactionHash;

    res.status(200).json({ 
      transactionHash,
      explorerUrl: `https://sepolia.basescan.org/tx/${transactionHash}`
    });
  } catch (error: any) {
    console.error('Send transaction error:', error);
    res.status(500).json({ 
      error: 'Failed to send transaction',
      details: error.message 
    });
  }
}
