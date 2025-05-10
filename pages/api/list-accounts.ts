
import { NextApiRequest, NextApiResponse } from 'next';
import { CdpClient } from "@coinbase/cdp-sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type } = req.query;

  try {
    const cdp = new CdpClient({
      apiKeyId: process.env.CDP_API_KEY_ID,
      apiKeySecret: process.env.CDP_API_KEY_SECRET,
      walletSecret: process.env.CDP_WALLET_SECRET,
    });

    let response;
    if (type === 'EVM') {
      response = await cdp.evm.listAccounts();
    } else if (type === 'SOLANA') {
      response = await cdp.solana.listAccounts();
    } else {
      return res.status(400).json({ error: 'Invalid wallet type' });
    }

    res.status(200).json({ accounts: response.accounts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
