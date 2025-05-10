
import { NextApiRequest, NextApiResponse } from 'next';
import { CdpClient } from "@coinbase/cdp-sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type } = req.body;

  try {
    const cdp = new CdpClient({
      apiKeyId: process.env.CDP_API_KEY_ID,
      apiKeySecret: process.env.CDP_API_KEY_SECRET,
      walletSecret: process.env.CDP_WALLET_SECRET,
    });

    if (type === 'EVM') {
      const newAccount = await cdp.evm.createAccount();
      const { transactionHash } = await cdp.evm.requestFaucet({
        address: newAccount.address,
        network: "base-sepolia",
        token: "eth",
      });

      res.status(200).json({ account: newAccount, transactionHash });
    } else if (type === 'SOLANA') {
      const newAccount = await cdp.solana.createAccount();
      const { transactionHash } = await cdp.solana.requestFaucet({
        address: newAccount.address,
        network: "solana-devnet",
        token: "sol",
      });

      res.status(200).json({ account: newAccount, transactionHash });
    } else {
      res.status(400).json({ error: 'Invalid wallet type' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
