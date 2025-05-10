
import { NextApiRequest, NextApiResponse } from 'next';
import { CdpClient } from "@coinbase/cdp-sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ownerAddress, network } = req.body;

  if (!ownerAddress) {
    return res.status(400).json({ error: 'Owner address is required' });
  }

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
    });

    console.log('Fetching owner account for address:', ownerAddress);
    // First validate the owner account exists
    const ownerAccount = await cdp.evm.getAccount({ address: ownerAddress });
    console.log('Owner account response:', ownerAccount);
    
    if (!ownerAccount) {
      console.log('Owner account not found');
      return res.status(404).json({ error: 'Owner account not found' });
    }

    console.log('Creating smart account for owner:', ownerAccount.address);
    // Create smart account with specific network config
    const smartAccount = await cdp.evm.createSmartAccount({
      ownerAddress: ownerAddress, // Use the original address directly
      network: network || 'base-sepolia',
      config: {
        salt: Date.now().toString(),
      }
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
}
