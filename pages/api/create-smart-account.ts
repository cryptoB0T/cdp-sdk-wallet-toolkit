
import { NextApiRequest, NextApiResponse } from 'next';
import { CdpClient } from "@coinbase/cdp-sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ownerAddress, network } = req.body;

  try {
    const cdp = new CdpClient({
      apiKeyId: process.env.CDP_API_KEY_ID,
      apiKeySecret: process.env.CDP_API_KEY_SECRET,
      walletSecret: process.env.CDP_WALLET_SECRET,
    });

    const smartAccount = await cdp.evm.createSmartAccount({
      ownerAddress,
      network
    });

    res.status(200).json({ 
      smartAccountAddress: smartAccount.address
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
