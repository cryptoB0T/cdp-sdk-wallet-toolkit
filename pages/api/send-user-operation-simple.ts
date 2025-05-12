import { NextApiRequest, NextApiResponse } from 'next';
import { CdpClient } from "@coinbase/cdp-sdk";
import { parseEther } from "viem";
import { getApiKeys } from '../../lib/api-config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { smartAccountAddress, network = "base-sepolia" } = req.body;

  try {
    // Get API keys
    const { apiKeyId, apiKeySecret, walletSecret } = getApiKeys();
    
    if (!apiKeyId || !apiKeySecret || !walletSecret) {
      return res.status(500).json({ error: 'Missing CDP configuration' });
    }

    // Initialize CDP client
    const cdp = new CdpClient({
      apiKeyId,
      apiKeySecret,
      walletSecret,
    });

    console.log('Creating a new EVM account...');
    // Create a new EVM account first (with signing capabilities in this session)
    const evmAccount = await cdp.evm.createAccount();
    console.log('Created EVM account:', evmAccount.address);
    
    // Then create a smart account using this account as the owner
    console.log('Creating a smart account...');
    const smartAccount = await cdp.evm.createSmartAccount({
      owner: evmAccount,
    });

    if (!smartAccount) {
      return res.status(404).json({ error: 'Failed to create smart account' });
    }
    
    console.log('Created smart account:', smartAccount.address);
    console.log(`Sending user operation from: ${smartAccount.address} on network: ${network}`);
    
    // Send the user operation using the newly created smart account
    // Temporarily ignore TypeScript error to allow build to succeed
    // @ts-ignore - Type instantiation is excessively deep and possibly infinite
    const userOperation = await cdp.evm.sendUserOperation({
      smartAccount: smartAccount,
      network: network,
      calls: [
        {
          to: "0x0000000000000000000000000000000000000000" as `0x${string}`,
          value: parseEther("0.000001").toString(),
          data: "0x" as `0x${string}`,
        },
      ] as any, // Use type assertion to bypass deep type instantiation error
    });

    console.log('User operation sent successfully:', userOperation);

    res.status(200).json({
      success: true,
      userOpHash: userOperation.userOpHash,
      smartAccountAddress: smartAccount.address,
      network
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Failed to send user operation',
      details: error.message
    });
  }
}
