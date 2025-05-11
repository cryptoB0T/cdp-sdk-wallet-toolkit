import { NextApiRequest, NextApiResponse } from 'next';
import { CdpClient } from "@coinbase/cdp-sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { smartAccountAddress, calls, network } = req.body;

  console.log('Received request body:', JSON.stringify(req.body, null, 2));

  if (!smartAccountAddress) {
    return res.status(400).json({ error: 'Smart account address is required' });
  }

  if (!calls) {
    return res.status(400).json({ error: 'Calls are required' });
  }
  
  if (!Array.isArray(calls)) {
    return res.status(400).json({ error: 'Calls must be an array' });
  }
  
  if (calls.length === 0) {
    return res.status(400).json({ error: 'Calls array cannot be empty' });
  }
  
  // Validate each call object
  for (let i = 0; i < calls.length; i++) {
    const call = calls[i];
    if (!call.to || typeof call.to !== 'string' || !call.to.startsWith('0x')) {
      return res.status(400).json({ 
        error: `Call at index ${i} has invalid 'to' property. Must be a string starting with '0x'.`,
        call
      });
    }
    
    if (call.value === undefined) {
      return res.status(400).json({ 
        error: `Call at index ${i} is missing 'value' property.`,
        call
      });
    }
    
    if (!call.data || typeof call.data !== 'string') {
      return res.status(400).json({ 
        error: `Call at index ${i} has invalid 'data' property. Must be a string.`,
        call
      });
    }
  }

  if (!network) {
    return res.status(400).json({ error: 'Network is required' });
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

    console.log('Fetching smart account:', smartAccountAddress);
    
    // According to the documentation, we need to work with the smart account directly
    let smartAccount;
    try {
      console.log('Attempting to get smart account by address:', smartAccountAddress);
      
      // Try to get the smart account directly using the address
      smartAccount = await cdp.evm.getSmartAccount({ address: smartAccountAddress } as any);
      
      if (!smartAccount) {
        console.log('Smart account not found by address, trying to find owner account');
        
        // If that fails, try to get the owner account first
        const ownerAccount = await cdp.evm.getAccount({ address: smartAccountAddress });
        
        if (!ownerAccount) {
          console.log('Owner account not found');
          return res.status(404).json({ error: 'Account not found' });
        }
        
        // Then create a smart account from the owner
        smartAccount = await cdp.evm.createSmartAccount({
          owner: ownerAccount,
        });
        
        if (!smartAccount) {
          console.log('Failed to create smart account from owner');
          return res.status(500).json({ error: 'Failed to create smart account' });
        }
      }
      
      console.log('Successfully working with smart account:', smartAccount.address);
      console.log('Sending user operation from smart account:', smartAccount.address);
      // Format calls for logging (in case they contain large data values)
      const loggableCalls = calls.map(call => ({
        to: call.to,
        value: call.value,
        data: call.data?.length > 100 ? `${call.data.substring(0, 100)}...` : call.data
      }));
      console.log('Calls to send:', JSON.stringify(loggableCalls, null, 2));
      
      // Send the user operation
      // Following the documentation exactly and ignoring TypeScript errors
      console.log('Smart account type:', typeof smartAccount, Object.keys(smartAccount));
      console.log('Network:', network);
      console.log('Calls structure:', JSON.stringify(calls, null, 2));
      
      // @ts-ignore - Ignoring TypeScript errors to follow documentation exactly
      const userOperation = await cdp.evm.sendUserOperation({
        smartAccount: smartAccount,
        network: network,
        calls: calls
      });
      
      console.log('User operation response:', JSON.stringify(userOperation, null, 2));

      // Wait for the user operation to be confirmed
      console.log('Waiting for user operation to be confirmed...');
      const confirmedOperation = await cdp.evm.waitForUserOperation({
        smartAccountAddress: smartAccount.address,
        userOpHash: userOperation.userOpHash,
      });

      console.log('Confirmed operation:', confirmedOperation);

      // Handle the response based on operation status
      if (confirmedOperation.status === 'complete' && 'transactionHash' in confirmedOperation) {
        res.status(200).json({ 
          status: confirmedOperation.status,
          userOpHash: userOperation.userOpHash,
          transactionHash: confirmedOperation.transactionHash,
          network
        });
      } else {
        res.status(200).json({ 
          status: confirmedOperation.status,
          userOpHash: userOperation.userOpHash,
          network
        });
      }
    } catch (error) {
      console.error('User Operation Error:', error);
      
      // Enhanced error logging
      console.error('Error type:', typeof error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      
      if (error.stack) {
        console.error('Error stack:', error.stack);
      }
      
      if (error.cause) {
        console.error('Error cause:', error.cause);
      }
      
      // Check if there's a more specific error code or details
      const errorDetails = error.message || 'Unknown error';
      const errorCode = error.code || 'UNKNOWN_ERROR';
      
      res.status(500).json({ 
        error: 'Failed to send user operation. Please try again.',
        details: errorDetails,
        code: errorCode,
        // Include the request parameters for debugging
        request: {
          smartAccountAddress,
          network,
          callsCount: calls?.length || 0
        }
      });
    }
  } catch (error) {
    console.error('CDP Client Error:', error);
    res.status(500).json({ 
      error: 'Failed to initialize CDP client',
      details: error.message 
    });
  }
}