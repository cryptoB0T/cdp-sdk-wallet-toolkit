
import { NextApiRequest, NextApiResponse } from 'next';
import { CdpClient } from "@coinbase/cdp-sdk";
import { createWalletClient, http, parseEther } from "viem";
import { toAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fromAddress, toAddress, amount } = req.body;

  try {
    const cdp = new CdpClient({
      apiKeyId: process.env.CDP_API_KEY_ID,
      apiKeySecret: process.env.CDP_API_KEY_SECRET,
      walletSecret: process.env.CDP_WALLET_SECRET,
    });

    const account = await cdp.evm.getAccount(fromAddress);
    
    const walletClient = createWalletClient({
      account: toAccount(account),
      chain: baseSepolia,
      transport: http(),
    });

    const hash = await walletClient.sendTransaction({
      to: toAddress,
      value: parseEther(amount),
    });

    res.status(200).json({ 
      transactionHash: hash,
      explorerUrl: `https://sepolia.basescan.org/tx/${hash}`
    });
  } catch (error: any) {
    console.error('Send transaction error:', error);
    res.status(500).json({ 
      error: 'Failed to send transaction',
      details: error.message 
    });
  }
}
