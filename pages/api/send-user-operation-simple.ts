import { NextApiRequest, NextApiResponse } from 'next';
import { CdpClient } from "@coinbase/cdp-sdk";
// Use viem instead of ethers for parsing ether values
import { parseEther } from "viem";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract required parameters from request body
  const { 
    smartAccountAddress, 
    network = "base-sepolia", // Default to base-sepolia
    calls,
    paymasterUrl // Optional parameter
  } = req.body;

  // Basic validation
  if (!smartAccountAddress) {
    return res.status(400).json({ error: 'Smart account address is required' });
  }

  // Validate environment variables
  if (!process.env.CDP_API_KEY_ID || !process.env.CDP_API_KEY_SECRET || !process.env.CDP_WALLET_SECRET) {
    return res.status(500).json({ 
      error: 'Missing CDP configuration. Please check environment variables.' 
    });
  }

  try {
    // Initialize CDP client
    const cdp = new CdpClient({
      apiKeyId: process.env.CDP_API_KEY_ID,
      apiKeySecret: process.env.CDP_API_KEY_SECRET,
      walletSecret: process.env.CDP_WALLET_SECRET,
    });

    // For simplicity, let's hardcode a default call if none provided
    const userCalls = calls || [
      {
        to: "0x0000000000000000000000000000000000000000",
        value: parseEther("0.000001"),
        data: "0x",
      },
    ];

    console.log(`Getting smart account: ${smartAccountAddress}`);
    
    // Create a new EVM account first
    console.log('Creating a new EVM account...');
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
    
    // Prepare the user operation parameters
    let userOpParams: any = {
      smartAccount: smartAccount,
      network: network,
      calls: userCalls,
    };

    // Add paymaster URL if provided
    if (paymasterUrl) {
      userOpParams.paymasterUrl = paymasterUrl;
    }

    // Send the user operation
    const userOperation = await cdp.evm.sendUserOperation(userOpParams);
    
    console.log(`User operation hash: ${userOperation.userOpHash}`);

    // Return the user operation details
    res.status(200).json({ 
      success: true,
      userOpHash: userOperation.userOpHash,
      smartAccountAddress: smartAccount.address,
      network
    });
    
  } catch (error) {
    console.error('Error sending user operation:', error);
    res.status(500).json({ 
      error: 'Failed to send user operation',
      details: error.message 
    });
  }
}
