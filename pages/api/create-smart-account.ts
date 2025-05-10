
import { NextApiRequest, NextApiResponse } from 'next';
import { CdpClient } from "@coinbase/cdp-sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ownerAddress, network } = req.body;

  if (!process.env.CDP_API_KEY_ID || !process.env.CDP_API_KEY_SECRET || !process.env.CDP_WALLET_SECRET) {
    return res.status(500).json({ 
      error: 'Missing CDP configuration. Please check environment variables.' 
    });
  }

  try {
    const cdp = new CdpClient({
      apiKeyId: process.env.CDP_API_KEY_ID,
      apiKeySecret: process.env.CDP_API_KEY_SECRET,
      walletSecret: process.env.CDP_WALLET_SECRET,
      network: network // Add network configuration
    });

    const smartAccount = await cdp.evm.createSmartAccount({
      ownerAddress,
      network,
      config: {
        salt: Date.now().toString(), // Add unique salt for deterministic deployment
      }
    });

    res.status(200).json({ 
      smartAccountAddress: smartAccount.address,
      network
    });
  } catch (error) {
    console.error('Smart Account Creation Error:', error);
    res.status(500).json({ 
      error: 'Failed to create smart account. Please check CDP configuration and network settings.',
      details: error.message 
    });
  }
}
