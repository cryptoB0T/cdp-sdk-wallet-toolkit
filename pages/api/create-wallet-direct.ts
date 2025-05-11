import { NextApiRequest, NextApiResponse } from 'next';
import { CdpClient } from "@coinbase/cdp-sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, name } = req.body;

  try {
    // Use environment variables directly
    const apiKeyId = process.env.CDP_API_KEY_ID;
    const apiKeySecret = process.env.CDP_API_KEY_SECRET;
    const walletSecret = process.env.CDP_WALLET_SECRET;
    
    // Log API keys in a safe way (only showing first few characters)
    console.log('Direct API Key ID (first 8 chars):', apiKeyId ? apiKeyId.substring(0, 8) + '...' : 'undefined');
    console.log('Direct API Key Secret (first 8 chars):', apiKeySecret ? apiKeySecret.substring(0, 8) + '...' : 'undefined');
    console.log('Direct Wallet Secret (first 8 chars):', walletSecret ? walletSecret.substring(0, 8) + '...' : 'undefined');
    
    if (!apiKeyId || !apiKeySecret || !walletSecret) {
      return res.status(500).json({ 
        error: 'Missing CDP configuration in environment variables.',
        details: 'Please make sure CDP_API_KEY_ID, CDP_API_KEY_SECRET, and CDP_WALLET_SECRET are set in your .env file.'
      });
    }

    const cdp = new CdpClient({
      apiKeyId,
      apiKeySecret,
      walletSecret,
    });

    if (type === 'EVM') {
      console.log('Creating EVM account with name:', name);
      const newAccount = await cdp.evm.getOrCreateAccount({ name });
      console.log('EVM account created:', newAccount.address);
      
      console.log('Requesting faucet funds for network:', req.body.network || "base-sepolia");
      const { transactionHash } = await cdp.evm.requestFaucet({
        address: newAccount.address,
        network: req.body.network || "base-sepolia",
        token: "eth",
      });
      console.log('Faucet transaction hash:', transactionHash);

      res.status(200).json({ account: newAccount, transactionHash });
    } else if (type === 'SOLANA') {
      console.log('Creating Solana account with name:', name);
      const newAccount = await cdp.solana.getOrCreateAccount({ name });
      console.log('Solana account created:', newAccount.address);
      
      // For Solana, the network is not specified in requestFaucet options
      // It defaults to devnet for the Solana faucet
      console.log('Requesting Solana faucet funds');
      const faucetResult = await cdp.solana.requestFaucet({
        address: newAccount.address,
        token: "sol"
      });

      // The Solana faucet result has a signature property instead of transactionHash
      const transactionHash = faucetResult.signature || '';
      console.log('Solana faucet signature:', transactionHash);
      
      res.status(200).json({ account: newAccount, transactionHash });
    } else {
      res.status(400).json({ error: 'Invalid wallet type' });
    }
  } catch (error) {
    console.error('Error creating wallet:', error);
    res.status(500).json({ 
      error: 'Failed to create wallet',
      details: error.message,
      stack: error.stack
    });
  }
}
