
import { NextApiRequest, NextApiResponse } from 'next';
import { CdpClient } from "@coinbase/cdp-sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, name } = req.body;

  try {
    const cdp = new CdpClient({
      apiKeyId: process.env.CDP_API_KEY_ID,
      apiKeySecret: process.env.CDP_API_KEY_SECRET,
      walletSecret: process.env.CDP_WALLET_SECRET,
    });

    if (type === 'EVM') {
      const newAccount = await cdp.evm.getOrCreateAccount({ name });
      const { transactionHash } = await cdp.evm.requestFaucet({
        address: newAccount.address,
        network: req.body.network || "base-sepolia",
        token: "eth",
      });

      res.status(200).json({ account: newAccount, transactionHash });
    } else if (type === 'SOLANA') {
      const newAccount = await cdp.solana.getOrCreateAccount({ name });
      // For Solana, the network is not specified in requestFaucet options
      // It defaults to devnet for the Solana faucet
      const faucetResult = await cdp.solana.requestFaucet({
        address: newAccount.address,
        token: "sol"
      });

      // The Solana faucet result has a signature property instead of transactionHash
      const transactionHash = faucetResult.signature || '';
      res.status(200).json({ account: newAccount, transactionHash });
    } else {
      res.status(400).json({ error: 'Invalid wallet type' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
